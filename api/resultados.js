export default async function handler(req, res) {
  res.status(200).json({
    actualizado: new Date().toISOString(),
    partidos: [
      {
        grupo: "A",
        local: "México",
        visitante: "Sudáfrica",
        golesLocal: 2,
        golesVisitante: 0
      },
      {
        grupo: "A",
        local: "Corea del Sur",
        visitante: "República Checa",
        golesLocal: 2,
        golesVisitante: 1
      }
    ]
  });
}
