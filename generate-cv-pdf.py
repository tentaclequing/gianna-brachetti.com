"""Generate CV PDF for Gianna Brachetti-Truskawa in signal-noise theme."""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Register fonts
pdfmetrics.registerFont(TTFont("Consolas", "C:/Windows/Fonts/consola.ttf"))
pdfmetrics.registerFont(TTFont("Consolas-Bold", "C:/Windows/Fonts/consolab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia", "C:/Windows/Fonts/georgia.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Bold", "C:/Windows/Fonts/georgiab.ttf"))
pdfmetrics.registerFont(TTFont("Georgia-Italic", "C:/Windows/Fonts/georgiai.ttf"))

# Colours from signal-noise theme
BLACK = HexColor("#000000")
WHITE = HexColor("#E4E4DC")
ACCENT = HexColor("#00AAFF")
ACCENT_RED = HexColor("#FF1F3D")
DIM = HexColor("#1E1E1C")
MUTED = HexColor("#8A8A84")
BODY_BG = HexColor("#F5F5F0")
DARK_TEXT = HexColor("#1A1A18")
SECTION_BG = HexColor("#EAEAE4")

W, H = A4
LEFT = 28 * mm
RIGHT = W - 28 * mm
CONTENT_W = RIGHT - LEFT

OUTPUT = "C:/Users/gianna.brachetti/ops/personal/gianna-brachetti.com/static/cv/gianna-brachetti-truskawa-cv.pdf"


def draw_dark_header(c, y):
    """Dark header block with name and roles."""
    header_h = 62 * mm
    c.setFillColor(BLACK)
    c.rect(0, H - header_h, W, header_h, fill=1, stroke=0)

    # Name
    c.setFillColor(WHITE)
    c.setFont("Georgia", 28)
    c.drawString(LEFT, H - 22 * mm, "Gianna Brachetti-Truskawa")

    # Roles line
    c.setFont("Consolas", 8)
    c.setFillColor(ACCENT)
    c.drawString(LEFT, H - 30 * mm, "// ")
    c.setFillColor(MUTED)
    c.drawString(
        LEFT + 14,
        H - 30 * mm,
        "Organic Growth Leader  /  Search & AI Product Manager  /  Multilingual Strategist",
    )

    # Profile
    c.setFont("Georgia", 8.5)
    c.setFillColor(HexColor("#C8C8C0"))
    profile = (
        "Product manager and organic growth leader with 17+ years in international search, now working at the "
        "intersection of search, AI, and security. Has managed web platforms with up to 900,000 daily active users. "
        "Designs frameworks that make complex technical "
        "problems accessible to non-technical teams, from prompt engineering methodologies for "
        "marketers to multi-level AI crawler governance published by the IAB. Sees teams like "
        "an octopus: multiple independent, intelligent minds that align and grow as one organism. "
        "Operates across "
        "engineering, product, and marketing with cross-functional leadership experience across "
        "30+ language markets."
    )
    y_prof = H - 37 * mm
    y_prof = draw_wrapped_text(
        c, profile, LEFT, y_prof, CONTENT_W, 11, "Georgia", 8.5, HexColor("#C8C8C0")
    )

    # Accent line at bottom of header
    c.setFillColor(ACCENT)
    c.rect(0, H - header_h, W, 0.6, fill=1, stroke=0)

    return H - header_h - 8 * mm


def draw_wrapped_text(c, text, x, y, max_w, leading, font, size, color):
    """Draw text with word wrapping. Returns new y position."""
    c.setFont(font, size)
    c.setFillColor(color)
    words = text.split()
    line = ""
    for word in words:
        test = line + (" " if line else "") + word
        if pdfmetrics.stringWidth(test, font, size) > max_w:
            c.drawString(x, y, line)
            y -= leading
            line = word
        else:
            line = test
    if line:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_section_title(c, title, y):
    """Draw section heading with accent line."""
    c.setFont("Consolas", 7.5)
    c.setFillColor(ACCENT)
    c.drawString(LEFT, y, "//")
    c.setFillColor(DARK_TEXT)
    c.drawString(LEFT + 14, y, title.upper())
    title_w = pdfmetrics.stringWidth(title.upper(), "Consolas", 7.5)
    c.setStrokeColor(HexColor("#D0D0CA"))
    c.setLineWidth(0.4)
    c.line(LEFT + 18 + title_w, y + 3, RIGHT, y + 3)
    return y - 12


def draw_experience_entry(
    c, title, company, period, location, bullets, y, compact=False, company_desc=None
):
    """Draw a single experience entry."""
    # Check if we need a new page
    min_needed = 14 + len(bullets) * 10 + (10 if company_desc else 0)
    if y < 30 * mm + min_needed:
        return y, False  # Signal that we need a new page

    # Title + company
    c.setFont("Georgia-Bold", 9)
    c.setFillColor(DARK_TEXT)
    c.drawString(LEFT, y, title)
    c.setFont("Georgia", 9)
    c.setFillColor(HexColor("#555550"))
    title_w = pdfmetrics.stringWidth(title, "Georgia-Bold", 9)
    c.drawString(LEFT + title_w + 4, y, "  -  " + company)

    # Period + location on right
    c.setFont("Consolas", 7)
    c.setFillColor(MUTED)
    period_loc = f"{period}  |  {location}"
    c.drawRightString(RIGHT, y + 1, period_loc)
    y -= 12

    # Company description (one-liner beneath company name)
    if company_desc:
        c.setFont("Georgia-Italic", 7.5)
        c.setFillColor(HexColor("#888880"))
        c.drawString(LEFT, y, company_desc)
        y -= 10

    # Bullets
    for bullet in bullets:
        c.setFillColor(ACCENT)
        c.setFont("Consolas", 6)
        c.drawString(LEFT + 4, y + 1, ">")
        y_new = draw_wrapped_text(
            c,
            bullet,
            LEFT + 14,
            y,
            CONTENT_W - 14,
            10,
            "Georgia",
            8,
            HexColor("#3A3A38"),
        )
        y = y_new - 2

    return y - (4 if compact else 6), True


def draw_skills(c, skills, y):
    """Draw skills grid."""
    for skill in skills:
        label = skill["label"]
        value = skill["value"]

        c.setFont("Consolas", 7)
        c.setFillColor(ACCENT)
        c.drawString(LEFT, y, label.upper())
        y -= 10

        y = draw_wrapped_text(
            c, value, LEFT + 2, y, CONTENT_W - 2, 10, "Georgia", 8, HexColor("#3A3A38")
        )
        y -= 6
    return y


def draw_dark_footer(c, page_num):
    """Dark footer bar."""
    footer_h = 12 * mm
    c.setFillColor(BLACK)
    c.rect(0, 0, W, footer_h, fill=1, stroke=0)
    c.setFillColor(ACCENT)
    c.rect(0, footer_h, W, 0.4, fill=1, stroke=0)

    c.setFont("Consolas", 6.5)
    c.setFillColor(MUTED)
    c.drawString(LEFT, 4.5 * mm, "gianna-brachetti.com")
    c.drawCentredString(W / 2, 4.5 * mm, "March 2026")
    c.setFillColor(HexColor("#565650"))
    c.drawRightString(RIGHT, 4.5 * mm, f"Page {page_num} of 2")


def draw_page_bg(c):
    """Light background for body area."""
    c.setFillColor(BODY_BG)
    c.rect(0, 12 * mm, W, H - 12 * mm, fill=1, stroke=0)


def generate_cv():
    c = canvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle("Gianna Brachetti-Truskawa - CV")
    c.setAuthor("Gianna Brachetti-Truskawa")
    c.setSubject("Search & AI Product Lead")

    # --- PAGE 1 ---
    draw_page_bg(c)
    y = draw_dark_header(c, H)

    # Experience
    y = draw_section_title(c, "Experience", y)

    experiences = [
        {
            "title": "Senior Product Manager, Search & CMS",
            "company": "DeepL",
            "company_desc": "Enterprise AI translation platform. 200,000+ business customers, 100+ supported languages.",
            "period": "2022 - Present",
            "location": "Cologne, Remote",
            "bullets": [
                "Leading a cross-functional team of 7 (engineers, QA, product designer, content strategist) and managing freelancers, owning organic user growth and search experience strategy. Grew organic traffic by 200% within the first year.",
                "Owning the search experience for anonymous web users - discovery, content surfacing, and conversion flows across 30+ language markets. Initially also product manager for Linguee, DeepL's linguistic search engine.",
                "Owning the content pipeline for landing, comparison, and conversion pages. Establishing cross-functional SEO alignment across the entire company.",
                "Working as product manager with a dedicated engineering team, shipping technical SEO, CRO, and Product Update Notifications. Owning and prioritising the tech SEO backlog.",
                "Building measurement and attribution dashboards (SQL, Metabase) to track organic impact on engagement and conversion. Running A/B tests (Statsig) to validate growth hypotheses and inform conversion rate optimisation.",
                "Built an internal search for the website based on Lunr as an experiment to improve content discovery.",
                "Helping teams adopt and understand AI capabilities: built an automated prompt engineering framework, custom Claude Code skills, and a Claude-to-Gemini skill porter. Built an internal LLM visibility tracker for competitive intelligence (hackathon, early 2024).",
                "Introduced frontend e2e testing at the company, including SEO QA automation with SpeedCurve, Audisto, Screaming Frog, Ahrefs, and Playwright.",
            ],
        },
        {
            "title": "VP of SEO",
            "company": "KaFe Rocks Ltd (via Startdowns GmbH)",
            "period": "2019 - 2022",
            "location": "Malta, Remote",
            "bullets": [
                "Strategic SEO leadership for an international iGaming affiliate, focused on sustainable white-hat growth across multiple markets.",
                "Drove programmatic SEO strategy for scaled content generation.",
            ],
        },
        {
            "title": "International Senior SEO Manager",
            "company": "bold ventures GmbH",
            "period": "2018 - 2019",
            "location": "Cologne",
            "bullets": [
                "Led technical and international SEO strategy for a web development agency's client portfolio, bridging software development and search marketing.",
                "Optimised for multi-platform discovery including Spotify. Presented on multi-platform and micro search systems optimisation at conferences.",
            ],
        },
        {
            "title": "International Senior SEO / Audience Manager",
            "company": "Aufeminin Group (gofeminin.de)",
            "period": "2017",
            "location": "Cologne / Paris",
            "bullets": [
                "Led team of international SEO managers for technical optimisation across the group's European publisher properties.",
                "Designed and implemented server log monitoring and analysis process for crawl behaviour insights at scale.",
                "Managed programmatic SEO for scaled content across multiple European markets.",
            ],
        },
        {
            "title": "Senior SEO Manager",
            "company": "Chefkoch GmbH",
            "period": "2015 - 2017",
            "location": "Bonn",
            "bullets": [
                "Managed SEO for a 65 million URL estate, one of Germany's largest web properties.",
                "Fine-tuned the on-site search (Solr), including autocomplete, result ranking, and alternative suggestions for zero-result queries, using search result data, user behaviour signals, and A/B tests.",
                "Applied data-driven analysis of search behaviour and conversion rate optimisation to feed insights back into content decisions and product features.",
                "Selected by Google as the first company in Germany to test new structured data markup formats (Schema.org/JSON-LD) before they became official search features. Achieved over 100% visibility gain through Rich Results and AMP.",
                "Designed context-sensitive product recommendation engine for recipe pages, bridging SEO signals with product UX.",
                "Drove programmatic SEO for scaled recipe and category page generation.",
                "Built automated JIRA-based content optimisation workflow, reducing manual coordination overhead across editorial and development teams.",
            ],
        },
        {
            "title": "Head of SEO",
            "company": "netspirits GmbH & Co. KG",
            "period": "2014 - 2015",
            "location": "Cologne",
            "bullets": [
                "Built new SEO expert team from scratch. Developed content marketing strategies for large-scale clients.",
            ],
        },
        {
            "title": "Team Lead SEO",
            "company": "arvato Bertelsmann",
            "period": "2012 - 2014",
            "location": "Cologne",
            "bullets": [
                "Led team of four SEO specialists managing large international e-commerce projects for Microsoft, ASUS, and Toshiba.",
                "Provided technical consulting for CMS migrations across Magento, Hybris, and Demandware platforms.",
            ],
        },
    ]

    page1_entries = 4  # First 4 entries on page 1
    for i, exp in enumerate(experiences[:page1_entries]):
        y, ok = draw_experience_entry(
            c,
            exp["title"],
            exp["company"],
            exp["period"],
            exp["location"],
            exp["bullets"],
            y,
            compact=(i > 0),
            company_desc=exp.get("company_desc"),
        )

    draw_dark_footer(c, 1)
    c.showPage()

    # --- PAGE 2 ---
    draw_page_bg(c)
    y = H - 18 * mm

    # Remaining experience
    y = draw_section_title(c, "Experience (continued)", y)
    for exp in experiences[page1_entries:]:
        y, ok = draw_experience_entry(
            c,
            exp["title"],
            exp["company"],
            exp["period"],
            exp["location"],
            exp["bullets"],
            y,
            compact=True,
            company_desc=exp.get("company_desc"),
        )

    # Skills
    y -= 4
    y = draw_section_title(c, "Skills & Expertise", y)
    skills = [
        {
            "label": "Search & Discovery",
            "value": "Search relevance, Autocomplete, Query understanding, A/B testing, Conversion rate optimisation, Strategic International SEO, Technical SEO, On-page SEO, Keyword research, Query fan-out analysis, Core Web Vitals, Log file analysis, Schema / JSON-LD, Content architecture, Crawl infrastructure, Localisation, Multi-language content",
        },
        {
            "label": "AI & Security",
            "value": "AI crawler governance, GEO (Generative Engine Optimisation), Prompt engineering, Meta-prompting, LLM behaviour analysis, Crawl security, Adversarial content analysis",
        },
        {
            "label": "Product & Leadership",
            "value": "Cross-functional programme leadership, Framework design, Stakeholder communication, Executive presentation, Systems thinking, Team building, coaching & mentoring, Freelancer management",
        },
        {
            "label": "Tools & Data",
            "value": "Google Search Console, GA4, Statsig, Screaming Frog, Ahrefs, Semrush, Audisto, Botify, Metabase, Solr, Elasticsearch, Lunr, SQL",
        },
        {
            "label": "Languages",
            "value": "German (native), English (fluent), French (intermediate), Italian (intermediate), Turkish (intermediate), Spanish & Portuguese (written understanding), Dutch (beginner), Norwegian (beginner)",
        },
    ]
    y = draw_skills(c, skills, y)

    # Publications
    y -= 2
    y = draw_section_title(c, "Publications", y)
    pubs = [
        "Multi-Level Approach to Managing AI Crawler Behaviour and Content Protection (IAB, 2024)",
        "Qualification Characteristics of Swearwords and Their Significance in Translation (Bachelor thesis, 2012)",
    ]
    for pub in pubs:
        c.setFillColor(ACCENT)
        c.setFont("Consolas", 6)
        c.drawString(LEFT + 4, y + 1, ">")
        y = draw_wrapped_text(
            c, pub, LEFT + 14, y, CONTENT_W - 14, 10, "Georgia", 8, HexColor("#3A3A38")
        )
        y -= 4

    # Memberships
    y -= 2
    y = draw_section_title(c, "Memberships", y)
    memberships = [
        "WiCyS - Women in Cybersecurity (since 2025)",
        "Women4Cyber Foundation (since 2025)",
    ]
    for mem in memberships:
        c.setFillColor(ACCENT)
        c.setFont("Consolas", 6)
        c.drawString(LEFT + 4, y + 1, ">")
        c.setFont("Georgia", 8)
        c.setFillColor(HexColor("#3A3A38"))
        c.drawString(LEFT + 14, y, mem)
        y -= 12

    # Education
    y -= 2
    y = draw_section_title(c, "Education", y)
    education = [
        {
            "degree": "BA Multilingual Communication (grade 1.3)",
            "school": "TH Koeln - Cologne University of Applied Sciences",
            "year": "2014",
        },
        {
            "degree": "Commercial Agent in Dialogue Marketing (Apprenticeship)",
            "school": "IHK",
            "year": "2008",
        },
    ]
    for edu in education:
        c.setFont("Georgia-Bold", 8.5)
        c.setFillColor(DARK_TEXT)
        c.drawString(LEFT, y, edu["degree"])
        c.setFont("Consolas", 7)
        c.setFillColor(MUTED)
        c.drawRightString(RIGHT, y + 1, edu["year"])
        y -= 11
        c.setFont("Georgia", 8)
        c.setFillColor(HexColor("#555550"))
        c.drawString(LEFT, y, edu["school"])
        y -= 14

    # Elsewhere
    y -= 2
    y = draw_section_title(c, "Elsewhere", y)
    elsewhere_items = [
        "Building an open-source prompt and context engineering framework designed to make AI tools accessible to non-technical knowledge workers.",
        "Building an MCP server for Audisto to integrate crawl data into AI-assisted workflows (github.com/tentaclequing/audisto-mcp).",
        "Writing and digital garden at gianna-brachetti.com.",
        "Volunteer in geriatric psychiatry (2004-2005). Faculty board member, TH Koeln (2011-2012). Former freelance translator (DE/EN/FR/IT).",
    ]
    for item in elsewhere_items:
        y = draw_wrapped_text(
            c, item, LEFT + 2, y, CONTENT_W - 2, 10, "Georgia", 8, HexColor("#555550")
        )
        y -= 4

    draw_dark_footer(c, 2)
    c.save()
    print(f"CV PDF generated: {OUTPUT}")


if __name__ == "__main__":
    generate_cv()
