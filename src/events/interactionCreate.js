const { ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const insults = ['use better footwork next time', 'try a knee bar', 'climb to the top next time', 'power scream more'];

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isButton()) {
			if (interaction.customId === 'meetup') {
				const modal = new ModalBuilder()
					.setCustomId('meetupModal')
					.setTitle('Meetup');

				// Create the text input components
				const locationInput = new TextInputBuilder()
					.setCustomId('meetupLocation')
					.setLabel('Where are you going?')
					.setStyle(TextInputStyle.Short)
					.setMinLength(1)
					.setMaxLength(100)
					.setPlaceholder('Leavenworth');

				const timeInput = new TextInputBuilder()
					.setCustomId('meetupTime')
					.setLabel('What time and day?')
					.setStyle(TextInputStyle.Short)
					.setMinLength(1)
					.setMaxLength(100)
					.setPlaceholder('12pm Saturday');

				// An action row only holds one text input,
				// so you need one action row per text input.
				const firstActionRow = new ActionRowBuilder().addComponents(locationInput);
				const secondActionRow = new ActionRowBuilder().addComponents(timeInput);

				// Add inputs to the modal
				modal.addComponents(firstActionRow, secondActionRow);

				// Show the modal to the user
				await interaction.showModal(modal);
			} else if (interaction.customId === 'punt') {
				const modal = new ModalBuilder()
					.setCustomId('puntModal')
					.setTitle('Punt Submission');

				// Create the text input components
				const climbInput = new TextInputBuilder()
					.setCustomId('puntClimb')
					.setLabel('What climb did you punt off of?')
					.setStyle(TextInputStyle.Short)
					.setMinLength(1)
					.setMaxLength(100)
					.setPlaceholder('Ross Bongo');


				const gradeInput = new TextInputBuilder()
					.setCustomId('puntGrade')
					.setLabel('Punt Grade')
					.setStyle(TextInputStyle.Short)
					.setRequired(false)
					.setMinLength(1)
					.setMaxLength(100)
					.setPlaceholder('V8');

				// An action row only holds one text input,
				// so you need one action row per text input.
				const firstActionRow = new ActionRowBuilder().addComponents(climbInput);
				const secondActionRow = new ActionRowBuilder().addComponents(gradeInput);

				// Add inputs to the modal
				modal.addComponents(firstActionRow, secondActionRow);

				// Show the modal to the user
				await interaction.showModal(modal);
			}
		} else if (interaction.isModalSubmit()) {
			try {
				if (interaction.customId === 'meetupModal') {
					const channel = await interaction.client.channels.fetch('874056575071969341');
					// Test channel #submit-bot-request
					// const channel = await interaction.client.channels.fetch('1161320242316849192');
					const location = interaction.fields.getTextInputValue('meetupLocation');
					const time = interaction.fields.getTextInputValue('meetupTime');

					const thread = await channel.threads.create({
						name: `${location} @ ${time}`,
						reason: `Meetup for ${interaction.user.username}.`,
					});
					console.log(`Created thread: ${thread.name}`);

					await thread.send({
						content: `<#${channel.id}> <@${interaction.user.id}>`,
						threadId: thread.id,
					});

					console.log('Sent initial thread message');
					await interaction.deferUpdate();
				}

				if (interaction.customId === 'puntModal') {
					const channel = await interaction.client.channels.fetch('1160977412385931284');
					const climb = interaction.fields.getTextInputValue('puntClimb');
					const grade = interaction.fields.getTextInputValue('puntGrade');

					const thread = await channel.threads.create({
						name: `${climb}${grade ? ` @ ${grade}` : ''}`,
						reason: `Punt submission for ${interaction.user.username}.`,
					});
					console.log(`Created thread: ${thread.name}`);

					const insultInteger = Math.floor(Math.random() * insults.length);
					await thread.send({
						content: `Upload a video or provide a link <@${interaction.user.id}>. Also, ${insults[insultInteger]}. <#${channel.id}> <@&${'1160976237758521386'}>`,
						threadId: thread.id,
					});

					console.log('Sent initial thread message');
					await interaction.deferUpdate();
				}
			} catch (error) {
				console.error(`Error executing ${interaction.customId}`);
				console.error(error);
			}
		}
	},
};