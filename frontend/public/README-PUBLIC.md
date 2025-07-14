# Structure du dossier public/

## 📁 Organisation des assets

### /icons/
Structure pour tous les types d'icônes :

#### /icons/favicons/
- `favicon.ico` - Favicon principal (16x16, 32x32, 48x48)
- `favicon-16x16.png` - 16x16px
- `favicon-32x32.png` - 32x32px  
- `favicon-96x96.png` - 96x96px

#### /icons/apple/
Icônes pour iOS/Safari :
- `apple-icon-57x57.png` - 57x57px
- `apple-icon-60x60.png` - 60x60px
- `apple-icon-72x72.png` - 72x72px
- `apple-icon-76x76.png` - 76x76px
- `apple-icon-114x114.png` - 114x114px
- `apple-icon-120x120.png` - 120x120px
- `apple-icon-144x144.png` - 144x144px
- `apple-icon-152x152.png` - 152x152px
- `apple-icon-180x180.png` - 180x180px (PRINCIPAL)

#### /icons/android/
Icônes pour Android/Chrome :
- `android-icon-192x192.png` - 192x192px
- `android-icon-512x512.png` - 512x512px

#### /icons/pwa/
Icônes pour Progressive Web App :
- `icon-72x72.png` - 72x72px
- `icon-96x96.png` - 96x96px
- `icon-128x128.png` - 128x128px
- `icon-144x144.png` - 144x144px
- `icon-152x152.png` - 152x152px
- `icon-192x192.png` - 192x192px
- `icon-384x384.png` - 384x384px
- `icon-512x512.png` - 512x512px

### /social/
Images pour réseaux sociaux :
- `og-image.png` - 1200x630px (Facebook, LinkedIn, WhatsApp)
- `twitter-card.png` - 1200x600px (Twitter)
- `linkedin-banner.png` - 1200x627px (LinkedIn spécifique)

### /assets/
Assets divers :
- `portfolio.svg` - Logo portfolio
- `me.png` - Photo de profil

### /img/
Images du site (backgrounds, etc.)

### /tech-icons/
Icônes de technologies

### Configuration files
- `manifest.json` - Configuration PWA
- `robots.txt` - Configuration SEO
- `sitemap.xml` - Plan du site

## 🔧 Installation des assets

1. Placez vos favicons dans `/icons/favicons/`
2. Placez vos icônes Apple dans `/icons/apple/`
3. Placez vos icônes Android dans `/icons/android/`
4. Placez vos images sociales dans `/social/`
5. Les chemins sont automatiquement configurés dans `app.vue`
