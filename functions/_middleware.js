// El .pages.dev no debe competir en Google con el dominio del cliente.
// Se manda noindex SOLO cuando entran por esa direccion; alta-colina.com
// sigue indexable. No sirve hacerlo con _headers: ese archivo no distingue
// por dominio y apagaria tambien el SEO del dominio real.
export async function onRequest(context) {
  const respuesta = await context.next();
  const host = new URL(context.request.url).hostname;
  if (host.endsWith(".pages.dev")) {
    const r = new Response(respuesta.body, respuesta);
    r.headers.set("X-Robots-Tag", "noindex, nofollow");
    return r;
  }
  return respuesta;
}
