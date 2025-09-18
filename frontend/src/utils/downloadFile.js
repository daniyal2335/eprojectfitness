// utils/downloadFile.js
export const downloadFile = async (url, filename) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    alert("Export failed");
    return;
  }

  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};
