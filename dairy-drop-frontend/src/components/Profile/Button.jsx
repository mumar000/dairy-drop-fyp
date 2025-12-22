export const Button = ({ children, variant = 'primary', ...props }) => {
    const base =
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition'

    const styles = {
        primary: 'bg-gray-900 text-white hover:bg-black',
        secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
        danger: 'border border-red-200 text-red-600 hover:bg-red-50',
    }

    return (
        <button className={`${base} ${styles[variant]}`} {...props}>
            {children}
        </button>
    )
}