(function(window, $) {
		window.OSnet = window.OSnet || {
			Components: {}
		};

		window.OSnet.Components.Attachments = window.OSnet.Components.Attachments || (function(options) {
			let Attachments = {};

			let Component = {
				$: null,
				status: {
					initialized: false,
				},
				templates: {
					attachment: null,
				},
				storage: {
					temporary: []
				},
				options: {},
				defaults: {
					readonly: false,
					ellipsis: {
						length: 32
					}
				}
			};

			Attachments.initialize = (function(selector) {
				if ( ! Component.status.initialized) {
					Component.$ = $(selector);
					
					if (Component.$.length) {
						Component.templates.attachment = Component.$.find('.attachment').parent().detach();
						
						Attachments.readonly(Component.options.readonly);
						
						bind();

						lightbox.option({
					      'resizeDuration': 450,
					      'wrapAround': true,
					      'fadeDuration': 350,
					      'imageFadeDuration': 350
					    });

						Component.status.initialized = true;
					}
				}				
			});

			Attachments.insert = (function(attachment) {
				let template = Component.templates.attachment.clone();
				
				template.find('.attachment-image').css('background-image', 'url("' + attachment.path.absolute + '")').attr({
					'href': attachment.path.absolute,
					'data-lightbox': 'attachment',
					'data-title': attachment.name
				});

				template.find('.attachment-name').text(ellipsis(attachment.name));
				template.find('input[type="hidden"][name="attachment[]"]').val(attachment.path.relative)
					.data({
						'name': attachment.name,
						'path': attachment.path
					});

				if (Component.options.readonly) {
					template.find('.delete-attachment').hide();

				} else {
					template.find('.delete-attachment').show();
				}

				let button = Component.$.find('#insert-attachment').parent();

				template.insertBefore(button);
			});

			Attachments.clean = (function() {
				if (Component.storage.temporary.length) {
					$.ajax({
						url: Component.$.data('clean-url'),
						type: 'post',
						data: {
							attachments: Component.storage.temporary
						},
					})
					.always(function() {
						Component.storage.temporary = [];
					});
				}
			});

			Attachments.pop = (function() {
				let attachments = Component.$.find('input[type="hidden"][name="attachment[]"]').map(function() {
					let path = $(this).val();

					let index = Component.storage.temporary.indexOf(path);

					if (index > -1) {
						Component.storage.temporary.splice(index, 1);
					}

					return {
						path: path,
						name: $(this).data('name')
					}
				}).get();

				return attachments;
			});

			Attachments.readonly = (function(readonly) {
				if (readonly == false && Component.options.readonly == false) {
					Component.$.find('.delete-attachment')
						.add('#insert-attachment').show();

				} else {
					Component.$.find('.delete-attachment')
						.add('#insert-attachment').hide();
				}
			});

			function bind() {
				Component.$.on('click', '.delete-attachment', function (event) {
					event.stopPropagation();

					let element = $(this).parents('.attachment');
					
					element.parent().remove();
				});

				Component.$.find('input[type="file"]').fileupload({
					dataType: 'json',
					formData: {
						category: 'attachments',
						name: Component.$.find('input[type="file"]').attr('name')
					},
					pasteZone: $(document),
					acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
					done: function(event, data) {
						let response = data.result;
						
						if (response.status.text == 'success') {
							Attachments.insert(response.data);
							Component.storage.temporary.push(response.data.path.relative);
						}
					}
				});

				Component.$.on('click', '#insert-attachment', function() {
					Component.$.find('input[type="file"]').trigger('click');
				});
			}

			function ellipsis(string, length, replacement) {
				length = length || Component.options.ellipsis.length;
				replacement = replacement || '...';

				if (string.length < length + replacement.length) {
					return string;
				} else {
					length = (length % 2 == 0) ? length : --length;

					let half = length / 2;
				
					return string.substring(0, half) + replacement + string.substring(string.length - half, string.length);
				}
			}

			(function construct(options) {
				$.extend(Component.options, Component.defaults, options);
			} (options));
			
			return Attachments;
		});
		
	} (window, jQuery));