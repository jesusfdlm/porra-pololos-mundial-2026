const API_BASE = "https://api.football-data.org/v4";

export default async function handler(req, res) {
  try {
    const token = process.env.FOOTBALL_DATA_TOKEN;

    if (!token) {
      return res.status(500).json({
        ok: false,
        error: "Falta FOOTBALL_DATA_TOKEN en Vercel"
      });
    }

    const response = await fetch(`${API_BASE}/competitions/WC/matches`, {
      headers: {
        "X-Auth-Token": token
      }
    });

    const data = await response.json();

    return res.status(200).json({
      ok: true,
      statusHttp: response.status,
      totalPartidos: data.matches?.length ?? 0,
      errorApi: data.errorCode || null,
      mensajeApi: data.message || null,
      primerosPartidos: (data.matches || []).slice(0, 5).map((m) => ({
        id: m.id,
        fecha: m.utcDate,
        estado: m.status,
        fase: m.stage,
        grupo: m.group,
        local: m.homeTeam?.name,
        visitante: m.awayTeam?.name,
        golesLocal: m.score?.fullTime?.home,
        golesVisitante: m.score?.fullTime?.away
      }))
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message
    });
  }
}
