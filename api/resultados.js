const API_BASE = "https://v3.football.api-sports.io";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Falta la variable FOOTBALL_API_KEY en Vercel"
      });
    }

    const response = await fetch(`${API_BASE}/fixtures?league=1&season=2026`, {
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Error consultando API-Football",
        detalle: data
      });
    }

    const partidos = (data.response || [])
      .filter((item) => {
        const status = item.fixture?.status?.short;
        return ["FT", "AET", "PEN", "LIVE", "1H", "2H", "HT"].includes(status);
      })
      .map((item) => {
        const grupo =
          item.league?.round?.replace("Group Stage - ", "") ||
          item.league?.round ||
          "";

        return {
          id: item.fixture?.id,
          fecha: item.fixture?.date,
          estado: item.fixture?.status?.short,
          ronda: item.league?.round,
          grupo,
          local: item.teams?.home?.name,
          visitante: item.teams?.away?.name,
          golesLocal: item.goals?.home,
          golesVisitante: item.goals?.away,
          logoLocal: item.teams?.home?.logo,
          logoVisitante: item.teams?.away?.logo
        };
      });

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=3600");

    return res.status(200).json({
      actualizado: new Date().toISOString(),
      fuente: "API-Football",
      partidos
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno en /api/resultados",
      detalle: error.message
    });
  }
}
