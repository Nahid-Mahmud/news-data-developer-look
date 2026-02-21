export default function generateUid(): string {
  const time = Date.now().toString(36); // Timestamp in base-36
  const random = Math.random().toString(36).substr(2, 5); // 5 random chars
  return (time + random).substr(0, 10); // Combine and limit to 10 chars
}
