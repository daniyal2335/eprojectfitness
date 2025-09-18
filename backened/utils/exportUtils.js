// backend/utils/exportUtils.js
import { Parser } from "json2csv";

export const toCSV = (data) => {
  if (!data || !data.length) return "";
  const parser = new Parser();
  return parser.parse(data);
};
