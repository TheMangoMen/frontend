import { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: '#facc14',
        'soft-grey': '#ECEDEE',
        'dark-grey': '#595959',
        'med-grey': '#c8c8c8',
        'soft-yellow': '#FFFEF1',
        'dark-blue': '#002F6D',
        'dark-green': '#175300',
        'dark-yellow': '#5D4B00',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fade: 'fadeIn .5s ease-in-out',
      },
      boxShadow: {
        red: "0 0 6px 6px rgba(239,68,68,0.5)",
        yellow: "0 0 10px 5px #5D4B00",
        blue: "0 0 10px 5px #002F6D",
        stats: [
          "20px 10px 50px 6px #C421FF60",
          "-20px 10px 50px 6px #FACC1490"
        ]
      },
      dropShadow: {
        red: "0 0 6px 6px rgba(239,68,68,0.5)",
        yellow: "0 0 10px 5px #5D4B00",
        blue: "0 10px 10px #002F6D",
        stats: [
          "20px 10px 50px 6px #C421FF60",
          "-20px 10px 50px 6px #FACC1490"
        ]
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config