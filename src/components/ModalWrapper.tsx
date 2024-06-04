import { type ReactNode, useEffect, useRef } from 'react'
import styles from './ModalWrapper.module.css'

function ModalWrapper(props: {
	header?: string
	children: ReactNode
	open: boolean
	onClose: () => void
}) {
	const dialogRef = useRef<HTMLDialogElement>(null)

	useEffect(() => {
		const dialog = dialogRef.current

		if (props.open) {
			dialog?.showModal()
		} else {
			dialog?.close()
		}

		function handleClose(event: Event) {
			if (event.target === dialog) {
				props.onClose()
			}
		}

		dialog?.addEventListener('close', handleClose)

		return () => {
			dialog?.removeEventListener('close', handleClose)
		}
	}, [props.open, props.onClose])

	return (
		<dialog ref={dialogRef}>
			<section className={styles.container}>
				<header className={styles.header}>
					{props.header && <h2>{props.header}</h2>}
					<button
						type="button"
						onClick={props.onClose}
						className={styles.closeButton}
					>
						╳
					</button>
				</header>
				<div>{props.children}</div>
			</section>
		</dialog>
	)
}

export default ModalWrapper
