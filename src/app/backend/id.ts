import { randomUUID } from "crypto";

export default function generateId() {
  // Old: return Math.random().toString(36).substr(2, 9);
  return randomUUID();
}