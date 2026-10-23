/**
 * Host half of the Matrix theme.
 *
 * This is a browser-side visual layer: the host only needs a mountable
 * plugin body so the package appears in the profile's cordis tree. The
 * browser half ships through `exports["./client"]` and is discovered from
 * the `dsh.client` declaration in package.json.
 */

/** Host plugin body — Matrix owns no host-side behaviour. */
export function apply() {}
