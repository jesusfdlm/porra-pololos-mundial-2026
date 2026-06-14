const API_BASE = "https://api.football-data.org/v4";

const traduccionesEquipos = {
  "Mexico": "México",
  "South Africa": "Sudáfrica",
  "South Korea": "Corea del Sur",
  "Czechia": "República Checa",
  "Canada": "Canadá",
  "Bosnia-Herzegovina": "Bosnia y Herzegovina",
  "United States": "Estados Unidos",
  "Paraguay": "Paraguay",
  "Qatar": "Catar",
  "Switzerland": "Suiza",
  "Brazil": "Brasil",
  "Morocco": "Marruecos",
  "Haiti": "Haití",
  "Scotland": "Escocia",
  "Australia": "Australia",
  "Turkey": "Turquía",
  "Germany": "Alemania",
  "Curaçao": "Curazao",
  "Curacao": "Curazao",
  "Netherlands": "Países Bajos",
  "Japan": "Japón",
  "Ivory Coast": "Costa de Marfil",
  "Ecuador": "Ecuador",
  "Sweden": "Suecia",
  "Tunisia": "Túnez",
  "Spain": "España",
  "Cape Verde": "Cabo Verde",
  "Belgium": "Bélgica",
  "Egypt": "Egipto",
  "Saudi Arabia": "Arabia Saudita",
  "Uruguay": "Uruguay",
  "Iran": "Irán",
  "New Zealand": "Nueva Zelanda",
  "France": "Francia",
  "Senegal": "Senegal",
  "Iraq": "Irak",
  "Norway": "Noruega",
  "Argentina": "Argentina",
  "Algeria": "Argelia",
  "Austria": "Austria",
  "Jordan": "Jordania",
  "Portugal": "Portugal",
  "DR Congo": "RD Congo",
  "Uzbekistan": "Uzbekistán",
  "Colombia": "Colombia",
  "England": "Inglaterra",
  "Croatia": "Croacia",
  "Ghana": "Ghana",
  "Panama": "Panamá"
};

function traducirEquipo(nombre) {
  return traduccionesEquipos[nombre] || nombre;
}

function convertirGrupo(group) {
  if (!group) return "";
  return group.replace("GROUP_", "");
}

export default async function handler(req, res) {
  try {
    const token = process.env.FOOTBALL_DATA_TOKEN;

    if (!token) {
      return res.status(500).json({
        error: "Falta FOOTBALL_DATA_TOKEN en Vercel"
      });
    }

    const response = await fetch(`${API_BASE}/competitions/WC/matches`, {
      headers: {
        "X-Auth-Token": token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Error consultando football-data.org",
        detalle: data
      });
    }

    const partidos = (data.matches || []).map((m) => ({
      id: m.id,
      fecha: m.utcDate,
      estado: m.status,
      fase: m.stage,
      grupo: convertirGrupo(m.group),
      local: traducirEquipo(m.homeTeam?.name),
      visitante: traducirEquipo(m.awayTeam?.name),
      golesLocal: m.score?.fullTime?.home,
      golesVisitante: m.score?.fullTime?.away
    }));

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=1800");

    return res.status(200).json({
      actualizado: new Date().toISOString(),
      fuente: "football-data.org",
      partidos
    });
  } catch (error) {
    return res.status(500).json({
      error: "Error interno en /api/resultados",
      detalle: error.message
    });
  }
}
