export default {
  resolveUser: async (client, interaction, userId) => {
    let kullanici = null;
    let status = "offline";

    // --- 1. Önce guild üzerinden member çekmeyi dene (status bilgisi için) ---
    if (interaction.guild) {
      try {
        const member = await interaction.guild.members.fetch(userId);
        kullanici = member.user;
        status = member.presence?.status ?? "offline";
      } catch (error) {
        // guild'de bulunamadı, client'a düşülecek
      }
    }

    // --- 2. Guild yoksa (DM) ya da fetch başarısız olduysa client'tan çek ---
    if (!kullanici) {
      try {
        kullanici = await client.users.fetch(userId);
      } catch (error) {
        console.log("Kullanıcı hiçbir şekilde bulunamadı:", error.message);
        return null; // ne guild'de ne client'ta bulunamadı
      }
    }

    return { kullanici, status };
  },
};