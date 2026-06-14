const API_BASE = "https://v3.football.api-sports.io";

export default async function handler(req, res) {
  try {
    const apiKey = process.env.FOOTBALL_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        ok: false,
        error: "No existe FOOTBALL_API_KEY en Vercel"
      });
    }

    const response = await fetch(`${API_BASE}/fixtures?league=1&season=2026`, {
      headers: {
        "x-apisports-key": apiKey
      }
    });

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      statusHttp: response.status,
      parametros: data.parameters,
      erroresApi: data.errors,
      resultadosEncontrados: data.results,
      totalResponse: Array.isArray(data.response) ? data.response.length : null,
      primerosPartidos: Array.isArray(data.response)
        ? data.response.slice(0, 5).map((item) => ({
            id: item.fixture?.id,
            fecha: item.fixture?.date,
            estado: item.fixture?.status,
            liga: item.league,
            local: item.teams?.home?.name,
            visitante: item.teams?.away?.name,
            goles: item.goals
          }))
        : data.response
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
