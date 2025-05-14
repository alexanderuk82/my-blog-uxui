# Rich Text Editor Implementation Guide

## Editor Recomendado: CKEditor 5

### ¿Por qué CKEditor 5?
- UI moderna y personalizable
- Excelente integración con React
- Soporte para modo oscuro
- Genera HTML limpio y semántico
- Plugins extensibles
- Buena documentación
- Comunidad activa

### Instalación

```bash
npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
```

### Configuración Básica

```jsx
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const PostEditor = ({ initialValue, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={initialValue}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        toolbar: [
          'heading',
          '|',
          'bold',
          'italic',
          'link',
          'bulletedList',
          'numberedList',
          '|',
          'outdent',
          'indent',
          '|',
          'blockQuote',
          'insertTable',
          'mediaEmbed',
          'undo',
          'redo',
          'codeBlock'
        ],
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
          ]
        }
      }}
    />
  );
};
```

### Integración con el Frontend

El contenido HTML generado por CKEditor se renderiza perfectamente con las clases Tailwind `prose` que ya tienes configuradas:

```jsx
<article 
  className="prose prose-lg dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: post.content }}
/>
```

### Personalización de Estilos

Para asegurar consistencia visual, añade estas clases en tu CSS:

```css
/* Estilo para el contenedor del editor */
.ck-editor__editable {
  min-height: 400px;
  max-height: 800px;
  color: theme('colors.gray.900');
  background-color: theme('colors.white');
}

/* Modo oscuro */
.dark .ck-editor__editable {
  color: theme('colors.gray.100');
  background-color: theme('colors.gray.900');
}

/* Estilos para bloques de código */
.ck-content pre {
  background-color: theme('colors.gray.100');
  padding: theme('spacing.4');
  border-radius: theme('borderRadius.md');
  font-family: theme('fontFamily.mono');
}

.dark .ck-content pre {
  background-color: theme('colors.gray.800');
}
```

### Manejo de Imágenes

Para el manejo de imágenes, recomendamos usar el plugin de upload personalizado:

```jsx
config={{
  // ... otras configs
  image: {
    upload: {
      types: ['jpeg', 'png', 'gif', 'webp'],
      handler: async (file) => {
        // Aquí implementar la lógica de subida a Cloudinary
        const imageUrl = await uploadToCloudinary(file);
        return {
          default: imageUrl
        };
      }
    }
  }
}}
```

### Plugins Recomendados

1. `@ckeditor/ckeditor5-highlight` - Para resaltado de texto
2. `@ckeditor/ckeditor5-code-block` - Para bloques de código
3. `@ckeditor/ckeditor5-markdown-gfm` - Soporte para Markdown
4. `@ckeditor/ckeditor5-autoformat` - Formateo automático

### Consideraciones de Seguridad

1. Sanitización de HTML:
```jsx
import DOMPurify from 'dompurify';

// En el componente que muestra el contenido
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(post.content) 
}} />
```

2. Configurar CSP (Content Security Policy) para permitir solo recursos confiables.

### Mejores Prácticas

1. Implementar autoguardado
2. Añadir confirmación antes de salir con cambios sin guardar
3. Mantener un historial de versiones del contenido
4. Implementar vista previa en tiempo real
5. Optimizar imágenes antes de subirlas

### Recursos Adicionales

- [Documentación oficial de CKEditor 5](https://ckeditor.com/docs/ckeditor5/latest/index.html)
- [Ejemplos de integración con React](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/frameworks/react.html)
- [Guía de personalización](https://ckeditor.com/docs/ckeditor5/latest/installation/advanced/theme-customization.html)
