export async function isValidPassword(
  inputPassword: string,
  hashedAdminPassword: string
) {
  return (await hashPassword(inputPassword)) === hashedAdminPassword;
}

async function hashPassword(password: string) {
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  return Buffer.from(arrayBuffer).toString("base64");
}
