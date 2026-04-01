import bcrypt from "bcrypt";
import prismaClient from "../database";

// npx ts-node src/scripts/seed-user.ts
// ou no container: node dist/scripts/seed-user.js

const seedUser = async () => {
    try {
        const email = "teste@gmail.com";
        const password = "Teste123@";
        const name = "Usuario Teste";

        // Verifica se usuário já existe
        const existingUser = await prismaClient.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            console.log(`❌ Usuário ${email} já existe no banco de dados.`);
            return;
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria o usuário
        const user = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: "CLIENT", // Valor padrão do enum
            }
        });

        console.log(`✅ Usuário criado com sucesso:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Nome: ${user.name}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Criado em: ${user.createdAt}`);

    } catch (error) {
        console.error("❌ Erro ao criar usuário:", error);
        process.exit(1);
    }
};

seedUser();