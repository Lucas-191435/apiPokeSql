-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'CLIENT') NOT NULL DEFAULT 'CLIENT',
    `name` VARCHAR(191) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `oauthId` VARCHAR(191) NULL,
    `oauthProvider` VARCHAR(191) NULL,
    `oauthProfileUrl` VARCHAR(191) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpiry` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_oauthId_key`(`oauthId`),
    UNIQUE INDEX `users_resetToken_key`(`resetToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokemon` (
    `id` VARCHAR(191) NOT NULL,
    `pokeId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `img1` VARCHAR(191) NULL,
    `img2` VARCHAR(191) NULL,
    `img3` VARCHAR(191) NULL,
    `types` VARCHAR(191) NULL,
    `abilities` VARCHAR(191) NULL,
    `height` DOUBLE NOT NULL DEFAULT 0,
    `weight` DOUBLE NOT NULL DEFAULT 0,
    `region` ENUM('KANTO', 'JOHTO', 'HOENN', 'SINNOH', 'UNOVA') NOT NULL DEFAULT 'KANTO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Pokemon_pokeId_key`(`pokeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` VARCHAR(191) NOT NULL,
    `pokeItemId` INTEGER NOT NULL,
    `pokeCategoryId` INTEGER NULL,
    `pokeItemPocketId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `sprite` VARCHAR(191) NULL,
    `category` ENUM('pokeballs', 'healing', 'pp_recovery', 'battle_items', 'held_items', 'evolution', 'berries_food', 'machines', 'collectibles', 'key_items', 'mail', 'crafting', 'special_mechanics', 'fossils_and_mining') NULL,
    `description` VARCHAR(191) NULL,
    `effect` VARCHAR(191) NULL,
    `isConsumable` BOOLEAN NOT NULL DEFAULT false,
    `isHeldItem` BOOLEAN NOT NULL DEFAULT false,
    `isBattleUse` BOOLEAN NOT NULL DEFAULT false,
    `isDiscardable` BOOLEAN NOT NULL DEFAULT false,
    `isPokemonUse` BOOLEAN NOT NULL DEFAULT false,
    `price` INTEGER NULL,
    `regions` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `items_pokeItemId_key`(`pokeItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
