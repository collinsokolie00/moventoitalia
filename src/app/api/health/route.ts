export async function GET() {
  return Response.json({
    success: true,
    service: "movento",
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
}
