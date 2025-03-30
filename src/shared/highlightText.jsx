export const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;

    const escapedSearch = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSearch})`, "gi");

    return text.split(regex).map((part, index) =>
        regex.test(part) ? (
            <span key={index} className="highlight">
                {part}
            </span>
        ) : (
            part
        )
    );
};