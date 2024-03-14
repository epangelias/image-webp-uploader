export async function imageToUrl(file: File) {
  const apiKey = "910a1b20168ef28376f3df239b16bdd7";
  const res = await uploadToImgBB(file, apiKey);
  if (res.status !== 200) {
    throw new Error("Could not upload image: " + res.error.message);
  }
  return res.data.url;
}

async function uploadToImgBB(file: File, apiKey: string) {
  const formData = new FormData();
  formData.append("image", file); // Use the file object directly

  const response = await fetch("https://api.imgbb.com/1/upload?key=" + apiKey, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data;
}
