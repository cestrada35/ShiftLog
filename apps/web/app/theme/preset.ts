// apps/web/app/theme/preset.ts
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'

export const ShiftLogPreset = definePreset(Aura, {
  semantic: {
    // primary: {
    //   50:  '#FDF5F0',
    //   100: '#FAE6DC',
    //   200: '#F4D1BC',
    //   300: '#E9B296',
    //   400: '#D98D68',
    //   500: '#A65F3E',
    //   600: '#8C4E33',
    //   700: '#733F28',
    //   800: '#5D341F',
    //   900: '#472718',
    //   950: '#321C11',
    // },
    
     primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
    },
    colorScheme: {
      light: {
        root: {
          primary: {
            color: '{primary.500}',
            contrastColor: '#ffffff',
            hoverColor: '{primary.600}',
            activeColor: '{primary.700}',
          },
        },
      },
      dark: {
        root: {
          primary: {
            color: '{primary.400}',
            contrastColor: '{surface.900}',
            hoverColor: '{primary.300}',
            activeColor: '{primary.200}',
          },
        },
      },
    },
  },
  components: {
    button: {
      root: {
        minHeight: '3.5rem',
        fontSize: '1.125rem',
        paddingX: '1.5rem',
      },
    },
    inputtext: {
      root: {
        minHeight: '3.5rem',
        fontSize: '1.5rem',
      },
    },
  },
})