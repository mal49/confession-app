import Turnstile from 'react-turnstile'

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'

export function TurnstileWidget({ onVerify, onError, onExpire }: TurnstileWidgetProps) {
  return (
    <div className="flex justify-center">
      <Turnstile
        sitekey={TURNSTILE_SITE_KEY}
        onVerify={onVerify}
        onError={onError}
        onExpire={onExpire}
        theme="dark"
      />
    </div>
  )
}

export default TurnstileWidget
