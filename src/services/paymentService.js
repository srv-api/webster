const BASE_URL =
  "https://api.posttest.co.id/merchant/topup";

export async function chargeGopay(harga) {
  const res = await fetch(`${BASE_URL}/charge-gopay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gross_amount: harga }),
  });

  if (!res.ok) throw new Error("GoPay gagal");
  return res.json();
}

// sementara dummy (tinggal ganti endpoint Dana)
export async function chargeDana(harga) {
  const res = await fetch(`${BASE_URL}/charge-dana`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gross_amount: harga }),
  });

  if (!res.ok) throw new Error("Dana gagal");
  return res.json();
}
