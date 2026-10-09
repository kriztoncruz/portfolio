# Krizton Cruz portfolio

A dependency-free, responsive portfolio using native HTML, CSS, and JavaScript, designed using the installed design-taste-frontend skill.

Run `node server.mjs` and open http://127.0.0.1:4173.

Edit content in `dist/index.html` and the theme in `dist/styles.css`. The portrait is stored in `dist/assets/krizton-cruz.jpg`, optimized from the supplied photograph. CSS frames it for desktop and mobile while keeping the original photograph unchanged. The project diagram illustrates document tracking; it is not a screenshot of DocTrack.

Contact: kriztoncruz@gmail.com.

Projects:
- DocTrack: https://doctrack-demo.onrender.com. The responsive diagram shows Register, Track, and Complete.
- Automated HR Payslip System for the National Privacy Commission, developed using Power Automate with a Power Apps interface.

Includes a fixed dark theme, reduced-motion support, keyboard focus styles, semantic navigation, metadata, and a custom favicon.

School logos are stored locally in `dist/assets/` and displayed in their original colors. Sources: [AMA University and Colleges](https://ama.edu.ph/), [Don Bosco Tarlac official school seal](https://www.dbtarlac.edu.ph/about-us/the-seal-of-the-school), and [Great Eastern Institute's La Paz school page](https://www.facebook.com/GEIGenerals/). Education uses a compact timeline from elementary through college, with four separate stages. The timeline runs vertically on all screen sizes.

Work experience covers the current Administrative Officer role at the National Privacy Commission, eLGU administration for the Local Government of La Paz, Tarlac, and an internship at the Department of Information and Communications Technology. Dates are omitted because they have not been provided.

The education dates are calculated backward from the supplied 2024 college graduation and durations: college 2020–2024, senior high 2018–2020, high school 2014–2018, and elementary 2005–2014. When the timeline enters view, its connecting line fills through the four milestones in sequence, from top to bottom on all screen sizes. The animation runs once per visit and respects reduced-motion settings.

The Work section uses Previous and Next buttons to loop through projects horizontally. Inactive slides are excluded from keyboard navigation. With JavaScript disabled, both projects and all education stages remain visible.

Larger school logos sit to the right of their timeline entries on desktop and mobile. Text reveals animate once as content enters view and respect reduced-motion settings. The header underline follows the current section while scrolling, with services grouped under Work.

Contact icons: Tabler Icons 3.49.0 (MIT), vendored inline from the official @tabler/icons package. Viber uses the phone-call icon. License: dist/licenses/tabler-icons.txt. Icon-only links include accessible names and hover titles.
