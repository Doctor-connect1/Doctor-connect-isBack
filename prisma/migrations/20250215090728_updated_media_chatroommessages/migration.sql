/*
  Warnings:

  - Added the required column `type` to the `Media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `media` ADD COLUMN `MessageID` INTEGER NULL,
    ADD COLUMN `type` ENUM('PNG', 'JPEG', 'PDF', 'DOC', 'DOCX', 'MP4', 'MP3') NOT NULL;

-- AddForeignKey
ALTER TABLE `Media` ADD CONSTRAINT `Media_MessageID_fkey` FOREIGN KEY (`MessageID`) REFERENCES `ChatroomMessages`(`MessageID`) ON DELETE SET NULL ON UPDATE CASCADE;
