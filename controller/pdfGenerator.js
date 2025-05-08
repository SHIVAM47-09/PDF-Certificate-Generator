import PDFDocument from 'pdfkit';

export const generatePdf = async (req, res) => {
    const {
        registerId,
        email,
        phone,
        addressLine1,
        cityPostal,
        state,
        country,
        title,
        subtitle,
        name,
        description,
        dateOfBirth,
        gender,
        bloodGroup,
        logo,
        certifiedLogo,
        dateTime
    } = req.body;

    const fileName = `certificate_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;

    const outerMargin = 8;
    const borderThickness = 15;
    const borderRadius = 15;

    doc.save()
        .lineWidth(borderThickness)
        .strokeColor('#87CEEB')
        .roundedRect(
            outerMargin + borderThickness / 2,
            outerMargin + borderThickness / 2,
            pageWidth - 2 * outerMargin - borderThickness,
            pageHeight - 2 * outerMargin - borderThickness,
            borderRadius
        )
        .stroke()
        .restore();


    const headerY = 60;
    doc.fillColor('black').font('Helvetica').fontSize(15)
        .text(`Register-Id: ${registerId}`, margin, headerY)
        .text(`E-Mail: ${email}`, margin, headerY + 20)
        .text(`Phone No: ${phone}`, margin, headerY + 40);

    doc.text(addressLine1, margin, headerY, { align: 'right', width: contentWidth })
        .text(cityPostal, margin, headerY + 20, { align: 'right', width: contentWidth })
        .text(`(${state}) ${country}`, margin, headerY + 40, { align: 'right', width: contentWidth });


    const logoY = headerY - 20;
    const logoWidth = 100;
    const logoHeight = 100;
    if (logo) {
        try {
            const resp = await fetch(logo);
            const arr = await resp.arrayBuffer();
            const buf = Buffer.from(arr);
            const logoX = (pageWidth - logoWidth) / 2;
            doc.image(buf, logoX, logoY, { width: logoWidth, height: logoHeight });
        } catch (err) {
            console.error('Logo fetch error', err);
        }
    }

    const bodyStartY = logoY + logoHeight + 50;

    doc.fillColor('#87CEEB')
        .font('Helvetica-Bold')
        .fontSize(40)
        .text(title, margin, bodyStartY, { width: contentWidth, align: 'center' });

    doc.fillColor('black')
        .font('Helvetica-Bold')
        .fontSize(18)
        .text(subtitle, margin, bodyStartY + 80, { width: contentWidth, align: 'center' });

    doc.fillColor('#b08d57')
        .font('Helvetica-Bold')
        .fontSize(32)
        .text(name, margin, bodyStartY + 120, { width: contentWidth, align: 'center' });

    const descWidth = contentWidth * 0.65;
    doc.fillColor('black')
        .font('Helvetica')
        .fontSize(14)
        .text(description, (pageWidth - descWidth) / 2, bodyStartY + 180, {
            width: descWidth,
            align: 'center'
        });

    const detailY = bodyStartY + 260;
    doc.fontSize(16)
        .text(`Date of Birth: ${dateOfBirth}`, margin, detailY, { align: 'left', width: contentWidth })
        .text(`Gender: ${gender}`, margin, detailY, { align: 'center', width: contentWidth })
        .text(`Blood Group: ${bloodGroup}`, margin, detailY, { align: 'right', width: contentWidth });

    const bottomY = pageHeight - 50;
    doc.fontSize(14).fillColor('black')
        .text(dateTime, margin + 20, bottomY - 20);

    doc.moveTo(margin, bottomY).lineTo(margin + 200, bottomY).stroke();
    doc.text('DATE-TIME', margin + 30, bottomY + 5);

    if (certifiedLogo) {
        try {
            const resp = await fetch(certifiedLogo);
            const arr = await resp.arrayBuffer();
            const buf = Buffer.from(arr);
            const logoX = (pageWidth - logoWidth) / 2;
            doc.image(buf, logoX, bottomY - 70, { width: logoWidth, height: logoHeight });
        } catch (err) {
            console.error('Certified logo fetch error', err);
        }
    }

    doc.moveTo(pageWidth - margin - 200, bottomY)
        .lineTo(pageWidth - margin, bottomY)
        .stroke();
    doc.text('SIGNATURE', pageWidth - margin - 150, bottomY + 5);

    doc.end();
};
