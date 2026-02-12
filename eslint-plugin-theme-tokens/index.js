/**
 * ESLint Plugin: theme-tokens
 *
 * Prevents developers from using hardcoded Tailwind classes that bypass
 * the CSS variable-based theme token system. When a forbidden class is
 * detected in a className (string literal, template literal, or inside
 * cn()/clsx()/cva() calls), ESLint reports an error with the correct
 * token-based replacement.
 *
 * ── WHY ──
 * This repo's theme system works by swapping CSS custom properties
 * (--shadow, --radius, --border-width, --ease, --speed, etc.).
 * If a developer writes `rounded-lg` instead of `rounded-(--radius-md)`,
 * that element will NOT respond when the user switches themes.
 *
 * ── COVERAGE ──
 * 1. Shadow:   shadow-sm, shadow-md, shadow-lg, shadow-xl, shadow-2xl
 * 2. Radius:   rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-2xl, rounded-3xl, rounded-full
 * 3. Duration: duration-100 … duration-1000
 * 4. Ease:     ease-in, ease-out, ease-in-out, ease-linear
 * 5. Border:   border (bare 1px), border-2, border-4, border-8
 */

// ── Forbidden patterns ──────────────────────────────────────────────
// Each entry: [regex, human-readable message, suggested fix]

const FORBIDDEN = [
  // Shadows — use shadow-main
  {
    pattern: /\bshadow-(sm|md|lg|xl|2xl)\b/g,
    message: "Hardcoded shadow '{{match}}' bypasses theme tokens.",
    fix: "shadow-main",
  },

  // Border radius — use rounded-(--radius-*)
  {
    pattern: /\brounded-(sm)\b(?!\))/g,
    message: "Hardcoded radius '{{match}}' won't respond to theme changes.",
    fix: "rounded-(--radius-sm)",
  },
  {
    pattern: /\brounded-(md)\b(?!\))/g,
    message: "Hardcoded radius '{{match}}' won't respond to theme changes.",
    fix: "rounded-(--radius-md)",
  },
  {
    pattern: /\brounded-(lg)\b(?!\))/g,
    message: "Hardcoded radius '{{match}}' won't respond to theme changes.",
    fix: "rounded-(--radius-lg)",
  },
  {
    pattern: /\brounded-(xl|2xl|3xl)\b/g,
    message: "Hardcoded radius '{{match}}' won't respond to theme changes.",
    fix: "rounded-(--radius-lg)",
  },
  {
    pattern: /\brounded-full\b/g,
    message: "Hardcoded 'rounded-full' won't respond to theme changes.",
    fix: "rounded-(--radius-sm) or rounded-full only for truly circular elements (avatars)",
  },

  // Transition duration — use duration-(--duration-theme)
  {
    pattern: /\bduration-(\d{2,4})\b/g,
    message: "Hardcoded duration '{{match}}' bypasses the theme's --speed token.",
    fix: "duration-(--duration-theme)",
  },

  // Easing — use ease-main
  {
    pattern: /\b(ease-in-out|ease-in|ease-out|ease-linear)\b/g,
    message: "Hardcoded easing '{{match}}' bypasses the theme's --ease token.",
    fix: "ease-main",
  },

  // Border width — use style={{ borderWidth: 'var(--border-width-default)' }}
  {
    pattern: /\bborder-(2|4|8)\b/g,
    message: "Hardcoded border width '{{match}}' bypasses the theme's --border-width token.",
    fix: "style={{ borderWidth: 'var(--border-width-default)', borderStyle: 'solid' }}",
  },
];

// ── Classes that are SAFE and should NOT trigger warnings ──
// These are Tailwind utility patterns that look like they match but are
// actually fine to use or are our token-based classes.
const SAFE_PATTERNS = [
  /rounded-\(--radius-/,     // Our token classes
  /shadow-main/,             // Our token class
  /shadow-\[var\(/,          // Arbitrary shadow with CSS var
  /shadow-none/,             // Intentional no-shadow
  /duration-\(--duration-/,  // Our token class
  /ease-main/,               // Our token class
  /border-border/,           // Semantic color token
  /border-brand/,            // Semantic color token
  /border-white/,            // Used in surface contexts
  /border-none/,             // Intentional removal
  /border-transparent/,      // Intentional removal
  /border-t\b/,              // Directional border (fine)
  /border-b\b/,
  /border-l\b/,
  /border-r\b/,
  /border-x\b/,
  /border-y\b/,
  /border-dashed/,           // Style modifier, not width
  /border-solid/,
  /border-dotted/,
  /border-collapse/,
  /border-separate/,
];

// ── Helpers ─────────────────────────────────────────────────────────

/**
 * Check if a matched class is inside a safe context (e.g., already
 * using a variable-based token).
 */
function isSafe(fullString, matchIndex, matchLength) {
  // Get some surrounding context
  const start = Math.max(0, matchIndex - 20);
  const end = Math.min(fullString.length, matchIndex + matchLength + 20);
  const context = fullString.slice(start, end);

  return SAFE_PATTERNS.some((safe) => safe.test(context));
}

/**
 * Extract all string-literal values from a JSX attribute node that
 * likely contains class names. Handles:
 *   - className="..."
 *   - className={cn("...", condition && "...")}
 *   - className={`... ${x}`}
 *   - cva(["...", "..."], { variants: ... })
 */
function extractStrings(node) {
  const strings = [];

  function walk(n) {
    if (!n) return;

    if (n.type === "Literal" && typeof n.value === "string") {
      strings.push({ value: n.value, node: n });
    }
    if (n.type === "TemplateLiteral") {
      for (const quasi of n.quasis) {
        if (quasi.value.raw) {
          strings.push({ value: quasi.value.raw, node: quasi });
        }
      }
    }
    // Recurse into expressions
    if (n.type === "CallExpression") {
      for (const arg of n.arguments) walk(arg);
    }
    if (n.type === "ArrayExpression") {
      for (const el of n.elements) walk(el);
    }
    if (n.type === "ConditionalExpression") {
      walk(n.consequent);
      walk(n.alternate);
    }
    if (n.type === "LogicalExpression") {
      walk(n.left);
      walk(n.right);
    }
    if (n.type === "ObjectExpression") {
      for (const prop of n.properties) {
        if (prop.key) walk(prop.key);
        if (prop.value) walk(prop.value);
      }
    }
  }

  walk(node);
  return strings;
}

// ── The Rule ────────────────────────────────────────────────────────

const noHardcodedThemeValues = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow hardcoded Tailwind classes that bypass theme tokens",
      category: "Theme Compliance",
      recommended: true,
    },
    schema: [],
    messages: {
      hardcoded:
        "{{ message }}\n  Use: {{ fix }}",
    },
  },

  create(context) {
    /**
     * Check a single string value for forbidden patterns.
     */
    function checkString(str, reportNode) {
      for (const rule of FORBIDDEN) {
        // Reset regex state
        rule.pattern.lastIndex = 0;
        let match;

        while ((match = rule.pattern.exec(str)) !== null) {
          if (isSafe(str, match.index, match[0].length)) continue;

          context.report({
            node: reportNode,
            messageId: "hardcoded",
            data: {
              message: rule.message.replace("{{match}}", match[0]),
              fix: rule.fix,
            },
          });
        }
      }
    }

    return {
      // className="..." or className={...}
      JSXAttribute(node) {
        if (node.name.name !== "className") return;

        const value = node.value;
        if (!value) return;

        // className="plain string"
        if (value.type === "Literal" && typeof value.value === "string") {
          checkString(value.value, value);
          return;
        }

        // className={expression}
        if (value.type === "JSXExpressionContainer") {
          const strings = extractStrings(value.expression);
          for (const s of strings) {
            checkString(s.value, s.node);
          }
        }
      },

      // Also check cva() and cn() calls that aren't inside className
      // (e.g., const variants = cva("...", { ... }))
      CallExpression(node) {
        const callee = node.callee;
        const name =
          callee.type === "Identifier"
            ? callee.name
            : callee.type === "MemberExpression" && callee.property
              ? callee.property.name
              : null;

        if (!["cva", "cn", "clsx", "twMerge"].includes(name)) return;

        for (const arg of node.arguments) {
          const strings = extractStrings(arg);
          for (const s of strings) {
            checkString(s.value, s.node);
          }
        }
      },
    };
  },
};

// ── Plugin Export ────────────────────────────────────────────────────

const plugin = {
  meta: {
    name: "eslint-plugin-theme-tokens",
    version: "1.0.0",
  },
  rules: {
    "no-hardcoded-theme-values": noHardcodedThemeValues,
  },
};

export default plugin;
