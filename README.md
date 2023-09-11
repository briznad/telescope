# Telescope
## Company data ingester

## TL;DR
Navigate to https://telescope.bradmallow.com/login and use the credentials shown in the field placeholders (username: `email@example.com`, password: `letmein123`) to access the system and explore the features yourself. The app is optimized for a mobile or small screen device, so when viewing on a desktop you may want to shrink the width of your browser.

## What
Telescope is an [app](https://telescope.bradmallow.com/), database, [API](https://telescope.bradmallow.com/api/companies), and [data warehouse](https://console.cloud.google.com/bigquery?sq=348985695659:fbede93d91424f3d9c45362c96fc6558).

## Why
To facilitate the inputting of company data, which is often exchanged in an unstructured format, into a structured system, allowing it to be used in data modeling.

### And to make it fun
Okay, so maybe fun is a stretch when describing data entry. But, informed by my conversation with Robby regarding gamification, I endeavored to go beyond the basic requirements and include elements that would encourage the users of the app to improve the quality of the data. I did this by including a metric that tracks the level of completion of optional fields for companies and reports. This score is visualized using a progress bar that animates as the form fields are populated. This subtle cue is made explicit on the Scoreboard section of the homepage, where a user's average completion scores can be viewed across different data types, and is compared against the global average.

## How
This project uses a wide range of technologies and solutions that punch above their weight to build, deploy, host, serve, manage, and analyze. Some of them are SvelteKit, Ionic, Typescript, Google Firestore, Capacitor, Firebase Auth, Google Big Query, Vercel Edge Functions, and many more.

Despite the fact that this was built as an interview project, I approached this as I would a production system. This system could be deployed to a production environment with minimal changes. However, I did have limited time to build, which informed my choices. I selected solutions that aided my ability to create the highest quality system in the shortest time. I'll detail those choices using the requested prompts:

### The systems design [I] use
Below are some of the pieces that I've utilized for this project.

#### Frontend framework - SvelteKit
SvelteKit is a full-featured web development framework and development environment that can build modular web components with well-sorted state management and reactivity. Some of the things it can do would be similar to React, React Router, and Redux. However, it also allows building your backend architecture along with your frontend.

#### Database - Google Firestore
"[Google’s Firestore is a NoSQL serverless database with real-time notification capability, and together with the Firebase ecosystem it greatly simplifies common app development challenges while letting the application developer focus primarily on their business logic and user experience.](https://research.google/pubs/pub52292/)"

#### UI toolkit - Ionic
Ionic is an open source UI toolkit for building performant, high-quality web apps using web technologies.

#### User management and authentication - Firebase Authentication
Firebase Authentication makes building secure authentication systems easy, while improving the sign-in and onboarding experience for end users. It provides an end-to-end identity solution, supporting email and password accounts, phone auth, as well as 3rd-party federated authentication via Google, Apple, Twitter, Facebook, GitHub, etc.

#### Web host - Vercel
Hosts and serves the static assets of the app, as well as the API endpoints, using a globally distributed edge compute model that provides the fastest possible experience for end users.

### Why [I] chose this approach
With my background having founded, built, and scaled my own startup from scratch, I am familiar with the challenge of doing a lot with a little. To deliver the most value and features to an end user with a small team or a tight deadline (or both) requires prioritization and a focus on reducing distractions and mental overhead. Yet, when designing a system for production there are numerous considerations that must be resolved and the complexity of the system can grow quickly. There is no one path to solve this equation, but there are solutions. My approach relies on components that work well together and can save me mental cycles, that I choose to then spend on delivering features to the end user.

#### Frontend Framework - SvelteKit
In many ways Svelte and SvelteKit are largely comparable with other frontend systems, such as React, Angular, or Vue. However, it has some distinct advantages, including the ability to build and deploy server components without having to incur the overhead of a separate backend system. This allowed me to build a simple API to query company and report data:
- list all companies
  - https://telescope.bradmallow.com/api/companies
- list all reports
  - https://telescope.bradmallow.com/api/reports
- retrieve 1 company
  - https://telescope.bradmallow.com/api/company/[id], e.g. https://telescope.bradmallow.com/api/company/gz6c7ffx
- retrieve 1 report
  - https://telescope.bradmallow.com/api/report/[id], e.g. https://telescope.bradmallow.com/api/report/fq84ej8q

SvelteKit also makes it simple to build fully reactive frontends, such that when data changes in the database that change can be reflected in the UI without requiring a page refresh. This is especially compelling for dashboards and analytics, where updates can modify reports in realtime.

#### Database - Google Firestore
There are a number of features that make Firestore compelling. As a fully managed IaaS offering, Firestore is very easy to start using and requires little consideration of setup or administration. This is important when development resources are constrained, allowing me to concentrate on delivering features. I can also relinquish concerns of scaling, since the managed offering will automatically scale as data and connection needs grow. Firestore also comes with client libraries that facilitate realtime data streaming. Along with the reactivity offered with SvelteKit, this combination makes building very responsive apps much easier and less time consuming. Lastly, the consideration of Firestore as a NoSQL database was key to allow quick work at the onset of a project that would expand and change. This is because Firestore doesn't require defining a fixed schema before the database can be used. When embarking on a new project quickly, it can be an impediment to development to spend too much time working in abstractions and data models that will likely need to shift as the concept is refined and iterated on. Firestore is much more flexible in this way. It also learns from usage patterns of how data is queried and will automatically create indexes on data as is necessary.

Beyond the specific details of Firestore as a database, it also benefits from the robust suite of Firebase and GCP integrations. In particular, Firestore can be easily connected to BigQuery. As a result, the modest amount of data in the test project is being replicated in realtime to a system that provides petabyte-scale querying. While overkill in this scenario, it nonetheless speaks to very relevant and powerful capabilities.

#### UI toolkit - Ionic
Ionic is my preferred UI toolkit, which offers various UI components that can be mixed and modified in a way that maintains visual cohesiveness and provides well-considered accessible interactions. This is important for an app that relies on extensive use of forms. The ability to tab through and use the keyboard to manipulate the form is crucial for efficient entry, and this is made much easier through Ionic's default UI components. Ionic components also adjust their style to match the user's system, so iPhone and Android users will both experience UI elements that reflect the dominate UI paradigms and customs of their respective systems. Lastly, Ionic also develops Capacitor, a system that allows building native apps using web app technologies. This provides an unparalleled ability to have a single codebase that can be deployed as a mobile or desktop web app, mobile native app, or even desktop native app.

#### User management and authentication - Firebase Authentication
Security is no joke. Like UI design, it relies on a complicated arrangement of layers to be carefully coordinated, and small mistakes can result in significant negative outcomes. User management is also an essential component of any system, even one as simple as this prototype. Therefore I prefer to offload the heavy lifting of authentication to a cohesive solution like Firebase Auth. Also, as an integrated offering with the rest of the Firebase ecosystem, it plays nice with Firestore. This provides the simplest possible solution to achieve granular security down to row-level auth.

#### Web host - Vercel
Vercel is a leading provider of managed application hosting services and, like Firebase products, is relentlessly focused on the needs of application developers. This provides the tools of an efficient, reliable ops system without an ops team. Vercel integrates with Github - my preferred DVCS provider - and SvelteKit provides a default adapter for Vercel. These 2 integrations combined means that deploying is as simple as a Git push, and both the frontend and API backend of my app will be served via globally-distributed edge compute servers.

## Etymology
Telescope is named for James Webb - no, not the [second Administrator of NASA](https://en.wikipedia.org/wiki/James_E._Webb) - we're talking about [the Australian competitive eater who can take down more chicken wings in 12 minutes than Joey Chestnut](https://youtu.be/7dyKpqLxJD4). He seemed like a fitting inspiration given that Telescope is all about efficient ingestion.
