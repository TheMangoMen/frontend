// Seasonal themes. To turn the Halloween theme off early, set `enabled` to
// false; otherwise it switches itself on and off by date.
export const HALLOWEEN = {
    enabled: true,
    // Months are 1-based. Active from the start date up to and including the end date.
    start: { month: 10, day: 1 },
    end: { month: 11, day: 1 },
};

export function isHalloween(date = new Date()) {
    if (!HALLOWEEN.enabled) return false;
    const v = (date.getMonth() + 1) * 100 + date.getDate();
    const { start, end } = HALLOWEEN;
    return v >= start.month * 100 + start.day && v <= end.month * 100 + end.day;
}

// The theme is the `halloween` class on <html>, which the `halloween:` Tailwind
// variant and the `.halloween` CSS overrides in globals.css key off.
export function applySeasonalTheme() {
    document.documentElement.classList.toggle("halloween", isHalloween());
}

// Runs before the page paints (see layout.tsx) so the theme doesn't flash in.
export const seasonalThemeScript = `(function(){try{
var h=${JSON.stringify(HALLOWEEN)};
if(!h.enabled)return;
var d=new Date(),v=(d.getMonth()+1)*100+d.getDate();
if(v>=h.start.month*100+h.start.day&&v<=h.end.month*100+h.end.day){document.documentElement.classList.add("halloween");}
}catch(e){}})();`;
