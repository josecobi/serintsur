import { defineArrayMember, defineField, defineType } from 'sanity';

const blockContent = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'H4', value: 'h4' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            { name: 'href', type: 'url', title: 'URL' },
            { name: 'blank', type: 'boolean', title: 'Open in new tab', initialValue: false },
          ],
        },
      ],
    },
  }),
  defineArrayMember({
    type: 'image',
    options: { hotspot: true },
    fields: [
      { name: 'alt', type: 'string', title: 'Alt text' },
      { name: 'caption', type: 'string', title: 'Caption' },
    ],
  }),
];

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Translated Rich Text',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'array', of: blockContent }),
    defineField({ name: 'en', title: 'English', type: 'array', of: blockContent }),
    defineField({ name: 'de', title: 'Deutsch', type: 'array', of: blockContent }),
  ],
});
