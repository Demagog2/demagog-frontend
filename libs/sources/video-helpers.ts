import { SourceVideoFormData } from '../schemas/sourceVideo'

export function getVideoIdHelperText(
  videoType: SourceVideoFormData['video_type']
) {
  switch (videoType) {
    case 'youtube':
      return 'Hash najdete v adresovém řádku prohlížeče v parametru v, tedy například hash videa https://www.youtube.com/watch?v=dQw4w9WgXcQ je dQw4w9WgXcQ'
    case 'facebook':
      return 'ID najdete v adresovém řádku prohlížeče za částí /videos/, tedy například ID videa https://www.facebook.com/musicretrobest/videos/3293833073961965/ je 3293833073961965'
    default:
      return ''
  }
}

export function getVideoIdLabel(videoType: SourceVideoFormData['video_type']) {
  switch (videoType) {
    case 'youtube':
      return 'YouTube hash videa'
    case 'audio':
      return 'URL audio souboru'
    case 'facebook':
      return 'Facebook ID videa'
    default:
      return 'ID videa'
  }
}
