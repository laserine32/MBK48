import Image from "next/image"
import Link from "next/link"

const AppLogo = () => {
	return (
		<>
			<Link href="/" className="flex-start">
				<div className={`flex flex-row items-end space-x-2`}>
					<Image src="/icon.png" width={32} height={32} alt={`MBK48 logo`} priority />
					<span className="text-xl">{`MBK48`}</span>
				</div>
			</Link>
		</>
	)
}

export default AppLogo
