export function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export function getQueryString(object: Record<string, any>) {
  let qs = "";
  for (const key in object) {
    const value = object[key];
    if (value) qs += `&${key}=${value}`;
  }
  return qs.replace("&", "?");
}

export function getCloudFlareDeliveryUrl(
  avatarId: string,
  variant: string = "public"
) {
  return `https://imagedelivery.net/aPDiyG044pHV2EO8w7d39Q/${avatarId}/${variant}`;
}

export async function getUploadedImageId(file: File, fileName: string) {
  const cloudflareRequest = await fetch(`/api/files`);
  const { uploadURL } = await cloudflareRequest.json();

  const form = new FormData();
  form.append("file", file, fileName);
  const {
    result: { id },
  } = await (
    await fetch(uploadURL, {
      method: "POST",
      body: form,
    })
  ).json();

  return id;
}
