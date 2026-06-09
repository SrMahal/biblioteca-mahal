export async function getPlayerIdentity() {
    try {
        const response = await fetch("/api/auth/me", {
            credentials: "include"
        });

        console.log("auth/me status:", response.status);

        const data = await response.json();

        console.log("auth/me data:", data);

        if (response.ok) {
            const user = data.user || data.usuario || data.data || data;

            return {
                id: user.id || null,
                name:
                    user.name ||
                    user.nome ||
                    user.username ||
                    user.email ||
                    "Jogador",
                isGuest: false
            };
        }
    } catch (error) {
        console.warn("Entrando como visitante:", error);
    }

    let guestName = localStorage.getItem("guestName");

    if (!guestName) {
        guestName = "Visitante-" + Math.floor(1000 + Math.random() * 9000);
        localStorage.setItem("guestName", guestName);
    }

    return {
        id: null,
        name: guestName,
        isGuest: true
    };
}