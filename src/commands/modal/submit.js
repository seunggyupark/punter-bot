const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
    
module.exports = {
	data: new SlashCommandBuilder()
		.setName('submit')
		.setDescription('Submit a meetup or punting video!'),
		async execute(interaction) {
            const meetupButton = new ButtonBuilder()
                .setCustomId('meetup')
                .setLabel('Request Meetup')
                .setEmoji("🗓️")
                .setStyle(ButtonStyle.Primary);
    
            const punterButton = new ButtonBuilder()
                .setCustomId('punt')
                .setLabel('Submit Punt')
                .setStyle(ButtonStyle.Success)
                .setEmoji("🏈");

            const row = new ActionRowBuilder()
			    .addComponents(meetupButton, punterButton);

            await interaction.reply({
                components: [row],
            });
        },
};