-- AlterTable
ALTER TABLE `media` MODIFY `type` ENUM('PNG', 'JPEG', 'PDF', 'DOC', 'DOCX', 'MP4', 'MP3') NOT NULL DEFAULT 'PNG';
