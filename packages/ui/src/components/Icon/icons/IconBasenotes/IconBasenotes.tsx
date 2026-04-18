// @ts-ignore
import IconBase from '../../IconBase'

const src = (
  <>
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 18V5l12-2v13"
    />
    <circle fill="currentColor" cx="6" cy="18" r="2.5" />
    <circle fill="currentColor" cx="18" cy="16" r="2.5" />
  </>
)

function IconBasenotes(props: any) {
  return <IconBase src={src} viewBox="0 0 24 24" {...props} />
}

export default IconBasenotes
