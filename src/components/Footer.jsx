export default function Footer() {
  return (
    <footer className="app-footer" id="app-footer">
      <div className="app-footer__content">
        <div className="app-footer__branding">
          <h3 className="app-footer__name">SkyCast AI</h3>
          <p className="app-footer__author">
            Built by <a href="https://github.com/SurajMadhavarapu" target="_blank" rel="noopener noreferrer"><strong>Suraj Madhavarapu</strong></a>
          </p>
        </div>

        <div className="app-footer__pma">
          <p className="app-footer__pma-label">Built for</p>
          <a
            href="https://www.linkedin.com/company/product-manager-accelerator/"
            target="_blank"
            rel="noopener noreferrer"
            className="app-footer__pma-link"
          >
            PM Accelerator
          </a>
          <p className="app-footer__pma-desc">
            The Product Manager Accelerator Program is designed to support PM professionals through every stage of their career. From students looking for entry-level jobs to Directors looking to make a career change, PM Accelerator has helped over hundreds of students land their dream jobs. The program provides PM coaching, mock interviews, and portfolio reviews to help aspiring PMs break into the field.
          </p>
        </div>

        <div className="app-footer__attribution">
          <p>Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Open-Meteo</a></p>
          <p>Geocoding by <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a></p>
          <p>AI Assistant by <a href="https://ollama.ai/" target="_blank" rel="noopener noreferrer">Ollama</a> (Mistral LLM)</p>
          <p>Maps by <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer">Leaflet</a> + <a href="https://carto.com/" target="_blank" rel="noopener noreferrer">CARTO</a></p>
        </div>
      </div>
    </footer>
  );
}
