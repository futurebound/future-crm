// src/components/DetailItem.jsx
export default function DetailItem({
  icon: Icon,
  label,
  value,
  multiline = false,
}) {
  return (
    <div className='flex gap-4'>
      <Icon className='mt-1 h-5 w-5 text-muted-foreground' />
      <div className='flex-1'>
        <p className='text-sm font-medium text-muted-foreground'>{label}</p>
        {multiline ? (
          <p className='whitespace-pre-wrap'>{value || 'Not provided'}</p>
        ) : (
          <p className={!value ? 'text-muted-foreground' : ''}>
            {value || 'Not provided'}
          </p>
        )}
      </div>
    </div>
  )
}
