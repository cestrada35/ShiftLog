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
            50: '{orange.50}',
            100: '{orange.100}',
            200: '{orange.200}',
            300: '{orange.300}',
            400: '{orange.400}',
            500: '{orange.500}',
            600: '{orange.600}',
            700: '{orange.700}',
            800: '{orange.800}',
            900: '{orange.900}',
            950: '{orange.950}'
    },
    colorScheme: {
      light: {
        // root: {
          primary: {
            color: '{primary.500}',
            contrastColor: '#ffffff',
            hoverColor: '{primary.600}',
            activeColor: '{primary.700}',
          },
        // },
      },
      dark: {
        // root: {
          primary: {
            color: '{primary.400}',
            contrastColor: '{surface.900}',
            hoverColor: '{primary.300}',
            activeColor: '{primary.200}',
          },
        // },
      },
    },
  },
  components: {
    button: {
      root: {
        fontSize: '1.125rem',
        paddingX: '1.5rem',
      },
    },
    inputtext: {
      root: {
        fontSize: '1.5rem',
      },
    },
  },
})