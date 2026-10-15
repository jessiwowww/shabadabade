const LIMITE_MB = 10;

/*
  Avviso, non errore: pubblicare resta possibile. Un blocco secco
  fermerebbe Sharon davanti a una scansione pesante senza darle
  un'alternativa; il sito serve comunque le immagini ridimensionate
  dalla CDN, quindi il peso costa spazio, non lentezza.
*/
export const avvisoPesoImmagine = (Rule) =>
  Rule.custom(async (value, context) => {
    const riferimento = value?.asset?._ref;
    if (!riferimento) return true;

    const client = context.getClient({ apiVersion: "2026-07-01" });
    const peso = await client.fetch("*[_id == $id][0].size", {
      id: riferimento,
    });
    if (!peso) return true;

    const mb = peso / 1024 / 1024;
    return mb > LIMITE_MB
      ? `Pesa ${mb.toFixed(1)} MB: oltre i ${LIMITE_MB} MB conviene esportarla più leggera.`
      : true;
  }).warning();
