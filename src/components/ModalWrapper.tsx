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
		<dialog ref={dialogRef} className={styles.dialog}>
			<section className={styles.container}>
				<div className={styles.content}>{props.children}</div>
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
			</section>
		</dialog>
	)
}

export default ModalWrapper
