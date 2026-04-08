---
title: "It's Not You - It's Google Search Console"
slug: "its-not-you-its-google-search-console"
date: 2026-03-27
original_date: "2024-03-20"
original_source: "Women in Tech SEO"
canonical: "https://www.womenintechseo.com/knowledge/its-not-you-its-google-search-console/"
type_label: deep analysis
tags: [seo, google-search-console, technical-seo, tooling]
description: "Google Search Console is a bit of a mess. A forensic walkthrough of its contradictions, deprecations, and data gaps - and what to do about them."
tldr: |
  Google Search Console provides inaccurate or incomplete information, contradicts itself across reports, deprecates useful tools without adequate replacements, and restricts data access. This article walks through 11 specific exhibits of GSC dysfunction and offers practical alternatives for monitoring, rendering, and troubleshooting.
---

## Raiders of the Lost Console: A Thrilling Adventure in the Dark World of Google Search Console Data (in 11 Chapters)

Website operators frequently encounter a common problem: numerous URLs become trapped in Google Search Console's "Discovered, not crawled" or "Crawled not indexed" categories. Many SEO professionals ignore this issue until the number of non-indexed pages exceeds indexed ones. However, recurring patterns in GSC prevent practitioners from resolving these problems effectively.

The tool presents several critical challenges:

- It provides inaccurate or incomplete information about site performance, indexation, crawling, and errors, sometimes contradicting itself or changing labels without notice.
- Google eliminates useful diagnostic tools, occasionally replacing them with inferior alternatives or nothing at all.
- Users must wait extended periods to see results from fixes or changes, and validation may stop entirely.
- The platform restricts access and control over site data. Users cannot export, filter, or query all necessary information. Managing multiple properties or users proves difficult, and API data may differ from UI data.
- The interface confuses users through cryptic error messages, obscure regex syntax, and inconsistent data retention practices.

**Solution approach:** Complement GSC with alternative tools and testing methods. Learn server log analysis, page rendering techniques, site health monitoring, and traffic comprehension.

---

## Exhibit 1: Incorrect Status Codes

SEO professionals traditionally used HTTP 410 status codes to distinguish intentional page removals from accidental errors. Google's documentation states: "All 4xx errors, except 429, are treated the same." However, GSC no longer clearly distinguishes between 410s and 404s in reporting.

The 410 (Gone) status code, according to IETF standards, indicates permanent resource unavailability and signals that webmasters desire removal of remote links to that resource. While 410s still accelerate crawl queue cleanup compared to 404s, [as explained by Simone de Palma](https://www.linkedin.com/feed/update/urn:li:activity:7060261964240826369?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7060261964240826369%2C7060330676885053440%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287060330676885053440%2Curn%3Ali%3Aactivity%3A7060261964240826369%29), GSC's failure to differentiate them creates problems. A [recent discussion in the Search Console Help Community](https://support.google.com/webmasters/thread/227261695/is-it-a-good-idea-to-show-410-gone-error-for-google-to-drop-pages-completely?hl=en) highlights this confusion. Unintended 404s might be removed from the index before correction.

---

## Exhibit 2: Page Indexing

### Incorrect Indexation Status

The "Crawled, Not Indexed" report lacks filtering options for specific URL types. More problematically, URLs appearing in this report as unindexed sometimes show as indexed in the URL Inspection tool, using identical crawl dates. These pages may even appear in Google Search results.

### Mismatch between crawl and cache

Google Search displays cache dates, but this feature frequently malfunctions, showing cached pages that return 404 errors. URL Inspection provides crawl dates but not cache dates - requiring users to navigate Google Search separately, locate the three-dot menu, expand options, and select Cache. This remains broken functionality.

### What's crawled is not what's cached

The disconnect between crawl dates and cache dates creates practical problems for publishers requiring current versions indexed. Google recently announced [they may deprecate cache altogether](https://searchengineland.com/google-search-officially-retires-cache-link-437122) beginning January 2024, eliminating even this workaround.

### URL Inspection contradictions

Crawl Stats may show a page was recently crawled by Googlebot, yet pressing "Live Test URL" claims GSC has never seen that URL. This represents what [Matt Tutt](https://twitter.com/MattTutt1/status/1730471272792855004) terms "Schrodinger's Crawl" - uncertain whether Google actually crawled specific pages.

### Data inaccessibility issues

Accessing crawl dates via [Search Console API](https://developers.google.com/webmaster-tools/search-console-api/about) requires requests to the service, limited to 2,000 calls daily. Large-domain SEOs must carefully [analyse their server access logs](https://www.searchenginejournal.com/seo-log-file-analysis-guide/419660) and orchestrate API calls to avoid exceeding limits. The [Screaming Frog Spider](https://www.screamingfrog.co.uk/how-to-automate-the-url-inspection-api/) tool can automate URL Inspection API queries if configured with property access, though results may mirror frontend inconsistencies.

---

## Exhibit 3: Confusing URL Inspection

Domains using separate mobile URLs experience unique problems. When Googlebot Smartphone accesses desktop URLs with JavaScript redirects to mobile equivalents, GSC doesn't indicate redirects occurred. The URL Inspection tool shows HTTP 200 responses and successful rendering of mobile pages without displaying intermediate redirect steps.

Google's documentation notes: "The test does not indicate that it has followed a redirect, nor will it display the final URL that was tested." Manual browser testing with Googlebot user agents (using tools like [Redirect Path by Ayima](https://www.ayima.com/insights/redirect-checker.html)) reveals redirects that GSC conceals.

This becomes especially problematic during domain migrations when inconsistent Search Console reporting causes traffic loss despite following Google's own migration guidance, as [one user reaching out to Search Console Help](https://support.google.com/webmasters/thread/9569013/lengthy-domain-migration-time-inconsistent-gsc-data-concerns?hl=en) documented.

---

## Exhibit 4: Administrative Nightmare

Managing user access across multiple GSC properties lacks bulk operations. Adding or removing team members requires individual property-by-property configuration, as [Myriam Jessier](https://www.linkedin.com/in/myriamjessier/) has documented. One practitioner reported creating a personal Google account, adding client GSC properties, then switching to a paid Google Workspace account - resulting in temporary email addresses with no way to remove associated access. After seven years, alert emails continue arriving.

---

## Exhibit 5: Data Delays

Search Console reports contain significant data delays:

- Performance data: 2-3 days
- Crawl stats: 4-5 days
- Web Core Vitals: 28-day evaluation window

The Core Web Vitals monitoring window makes timing unclear regarding when evaluation periods begin or end. Though users can initiate revalidation manually, the 28-day window doesn't align with other GSC reports' evaluation periods, complicating cross-report analysis.

---

## Exhibit 6: Regex Spiced A La GSC

To circumvent API limitations or access unsampled data, practitioners need URL structures supporting multiple GSC properties. This requires restructuring or implementing redirects - risky for large domains. Properties only record data from setup dates forward, preventing historical data access despite Google possessing that information.

Bing Webmaster Tools automatically clusters URL directories, while GSC requires manual property creation.

### Filtering via regular expressions

GSC uses RE2 regex syntax. Pre-filters like "exclude/include" affect results. See [Myriam Jessier's article about Regular Expressions for SEO](https://www.pragm.co/post/regular-expression-for-seo) for practical guidance. AI language models cannot reliably generate working GSC regex patterns.

---

## Exhibit 7: Deprecation of Helpful Tools

Google has systematically removed useful diagnostic tools:

- **Structured Data Testing Tool** ([deprecated July 2020, partially restored](https://developers.google.com/search/blog/2020/12/structured-data-testing-tool-update))
- **[URL Parameter Tool](https://developers.google.com/search/blog/2022/03/url-parameters-tool-deprecated)** (discontinued April 2022)
- **[International Targeting Report](https://twitter.com/googlesearchc/status/1562369672430997504)** (discontinued September 2022)
- **Good Page Experience filter** (discontinued November 2023)
- **[Robots.txt Tester](https://www.google.com/webmasters/tools/robots-testing-tool)** (deprecated December 2023)
- **Mobile Usability Report and Mobile-Friendly Test** (deprecated December 2023)
- **[Crawl Rate Limiter](https://developers.google.com/search/blog/2023/11/sc-crawl-limiter-byebye?hl=en)** (deprecated January 2024)
- **[Sitemap ping endpoint](https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping)** (discontinued December 2023)
- **[Cache Link](https://twitter.com/searchliaison/status/1753156161509916873)** (deprecated January 2024)

Replacements often lack original functionality. The new robots.txt Report cannot test unpublished changes, and Google's documentation now references third-party testers. The International Targeting Report deletion forced reliance on external tools for hreflang debugging.

---

## Exhibit 8: Cryptic Error Class Notifications

Error notification emails cluster issues into broad categories - such as "indexation error" - without specifying which of 13+ specific error types occurred. Users cannot determine priority without manual investigation. When GSC changes error classifications, these changes appear inconsistently across the platform, sometimes acknowledged only in buried documentation.

---

## Exhibit 9: It's a Long Road to Validation

Revalidation timelines remain indefinite. Fixes require weeks to show validated status. When requesting revalidation for corrected URLs, GSC tests all URLs in that error class and terminates early if encountering unfixed errors, without specifying which URLs validated successfully or where termination occurred.

Exports contain only 1,000 URLs maximum, making URL mapping against fixes impractical.

---

## Exhibit 10: Crawl Stats

### 90 days data retention

Crawl Stats display only 90 days of information, while Performance Reports extend 16 months. Comparing crawl behaviour over extended periods or against performance movements becomes impossible.

### Insufficient data exports

Crawl Stats exports are sampled. The first tab shows average response times per crawl date across 90 days. The second tab lists 1,000 URLs with crawl dates and status codes - but not response times per URL. Response time data isn't available via API.

### Root-level data only

[Google will only report root-level data](https://support.google.com/webmasters/answer/9679690?hl=en). GSC reports Crawl Stats only at root domain level. Accessing stats through smaller properties (domain.com/en/) redirects to the main property, showing only sampled domain-wide data.

### Missing requests

Comparing server access logs (after reverse DNS verification of actual Googlebot requests) against Crawl Stats reveals discrepancies. Google fails to report all requests made.

---

## Exhibit 11: Performance Numbers Do Not Add Up

### Sampled Data

GSC presents only sampled data - a representative selection deemed sufficient for reporting. Even small sites benefit from multiple properties for more complete (though still sampled) pictures. Administrative burden increases with each property managed.

### Search Console UI vs. API

Data exported from the GSC interface differs from data retrieved via Search Console API. Tools aggregating GSC data with other metrics pull via API, creating discrepancies that undermine manager confidence in budget requests for API data warehousing or third-party tool subscriptions. [Schema App created specific guides to explain the discrepancies](https://support.schemaapp.com/support/solutions/articles/33000275946-data-discrepancies-gsc-vs-spa).

### Clicks vs. Traffic

GSC reports clicks; Google Analytics tracks sessions. These metrics differ fundamentally - [read Michael King's explanation](https://ipullrank.com/why-google-search-console-google-analytics-data-never-matches) for a thorough breakdown.

### Report feature changes affect clicks

Feature modifications alter reported click data without notice. July 2023 changes to the Page Indexing report caused apparent spikes in error counts, creating confusion.

### Hidden queries

Studies by [Ahrefs](https://ahrefs.com/blog/gsc-hidden-terms-study/) and [blinkseo](https://www.blinkseo.co.uk/blog/whats-going-on-with-google-search-consoles-hidden-click-data/) demonstrate that substantial percentages of search queries remain unreported in GSC. [Daniel Foley Carter](https://www.linkedin.com/feed/update/urn:li:activity:7060261964240826369?commentUrn=urn%3Ali%3Acomment%3A%28activity%3A7060261964240826369%2C7060634403583975424%29&dashCommentUrn=urn%3Ali%3Afsd_comment%3A%287060634403583975424%2Curn%3Ali%3Aactivity%3A7060261964240826369%29) and [Max Peters](https://twitter.com/maxjpeters/status/1730497431861936356) have noted the impact on data reporting. Google attributes this to query anonymisation for privacy protection and data sampling for noise reduction.

---

## Do not rely on GSC (for anything)

Build supplementary infrastructure compensating for GSC's limitations. Develop server log analysis capabilities, implement page rendering testing, establish health monitoring systems, and understand traffic sources independently.

### Monitoring on a budget

Tools like [Testomato](https://www.testomato.com/) and [LittleWarden](https://littlewarden.com/) provide affordable site health checks. Testing one URL per template conserves budget.

### Rendering

**Bulk checks:** [Screaming Frog](https://www.screamingfrog.co.uk/seo-spider/) or [Sitebulb](https://sitebulb.com/) enable comprehensive testing, potentially including automation and monitoring with technical expertise.

**Manual batch testing:** Use Lighthouse in browsers or [web-based tools provided by Onely.com](https://www.onely.com/tools/). Olga Zarr's ["Render as Google" guide](https://seosly.com/blog/render-as-google/) offers additional alternatives.

### What you can use GSC for

GSC provides value as a troubleshooting resource when lacking comprehensive infrastructure or as fallback monitoring. Users can [filter GSC alerts for specific error classes](https://www.linkedin.com/pulse/use-filters-specific-search-console-error-gianna/), focusing on urgent issues. There are [amazing tutorials](https://www.youtube.com/watch?v=spzHT0f60P4) demonstrating effective Search Console usage.

However, treat it as a supplementary tool rather than sole data source.

Add insights from [Bing Webmaster Tools, which can give you different insights](https://tentaclequing.medium.com/bing-wmt-the-underdog-in-seo-9e9da7ae9b86) into your domain. Data discrepancies don't indicate failure - they reflect GSC's inherent limitations.

---

## What to do if it really *is* you (not GSC)

**Primary principle:** Don't panic. [Comprehensive guides exist for troubleshooting any GSC error](https://thegray.company/blog/find-and-fix-gsc-errors).

---

## Conclusion: Is this thing on?

Google Search Console remains valuable despite its flaws.

Google has received extensive SEO community feedback about improvements. After decades of operation, basic issues like accurate HTTP status code reporting shouldn't baffle such a company.

Tool deprecation without superior replacements leaves practitioners working in darkness. Optimistic persistence drives the field forward - complementing GSC's problematic data with alternative tools and managing this temperamental platform's inconsistencies.

A company monopolising organic traffic sources carries responsibility for providing reliable, well-documented tools. Current limitations exclude smaller businesses, especially those in economically disadvantaged regions unable to afford infrastructure or third-party solutions.

---

## Helpful resources

- [Myriam Jessier: Get Started With GSC Queries In BigQuery](https://www.searchenginejournal.com/get-started-bigquery-queries/505149/)
- [Justyna Jarosz: How To Fix "Page indexed without content" in Google Search Console](https://www.onely.com/blog/how-to-fix-page-indexed-without-content-in-google-search-console/)
- [Tomek Rudzki: Mastering Google's Index - 5 Proven Steps to Fix "Crawled - Currently Not Indexed"](https://www.onely.com/blog/how-to-fix-crawled-currently-not-indexed-in-google-search-console/)
- [Ania Siano: How To Fix "Page with redirect" in Google Search Console](https://www.onely.com/blog/how-to-fix-page-with-redirect/)
- [Roger Montti: A Complete Google Search Console Guide For SEO Pros](https://www.searchenginejournal.com/google-search-console-guide/209318/)
