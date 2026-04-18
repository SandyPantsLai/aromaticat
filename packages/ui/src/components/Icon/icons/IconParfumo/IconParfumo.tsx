// @ts-ignore
import IconBase from '../../IconBase'

const src = (
  <>
    <path fill="currentColor" d="M11 2h2v5h-2z" />
    <path
      fill="currentColor"
      d="M9 7h6l2 3v11a2 2 0 01-2 2H9a2 2 0 01-2-2V10l2-3z"
    />
  </>
)

function IconParfumo(props: any) {
  return <IconBase src={src} stroke="none" viewBox="0 0 24 24" {...props} />
}

export default IconParfumo
