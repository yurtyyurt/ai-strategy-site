# AI Market Strategy Dashboard

Static single-file portfolio dashboard with:

- **7-tab interface**: Universe, Backtests, Scenarios, My Portfolio, Model Portfolios, Exit Rules, 10-Year Forecast
- **PORTFOLIO_CONFIG**: Editable JSON block at the top of the script — update holdings, theses, and alert rules without touching code
- **Client-side alerts**: Price-break, concentration, and EXIT-verdict detection with optional Zapier webhook integration
- **Thesis cards**: Collapsible per-holding cards with fundamentals, key drivers, and manual break toggles
- **Edit modal**: In-browser holdings/thesis editor with JSON export

## Deployment

Deploys on **Vercel** from the `main` branch.  
Root is served from `ai-strategy-site/index.html`.

Any push to `main` triggers an automatic redeploy.

## Local use

Open `ai-strategy-site/index.html` directly in a browser — no server required.
