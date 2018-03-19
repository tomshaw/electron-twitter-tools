import bagOfWords from '@/config/afinn/afinn.json'

const sentimentLexicon = bagOfWords => {
  let data = []
  for (let i = 0, total = bagOfWords.length; i < total; i++) {
    data[bagOfWords[i].word] = parseInt(bagOfWords[i].value)
  }
  return data
}
  
export default sentimentLexicon(bagOfWords)
