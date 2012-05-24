package jp.openform.pdf;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.Reader;

import org.apache.commons.io.IOUtils;
import org.mozilla.javascript.Context;
import org.mozilla.javascript.ContextFactory;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.tools.shell.Global;

public class PdfGenerator {
	
	private final Global global;
	private final Context context;
	private final Scriptable scope;
	
	public PdfGenerator(final InputStream... libraries) throws PdfGenerateException {
		this.global = new Global();
		this.context = ContextFactory.getGlobal().enterContext();
		global.init(context);
		this.scope = context.initStandardObjects(global);

		int index = 0;
		for (final InputStream is : libraries) {
			loadFile(is, index++);
		}
	}
	
	public void write(final String form, final String dataSources, final OutputStream os) throws PdfGenerateException {
		write(form, dataSources, null, os);
	}

	public void write(final String form, final String dataSources, final Integer[] pages, final OutputStream os) throws PdfGenerateException {
		scope.put("form", scope, form);
		scope.put("dataSources", scope, dataSources);
		scope.put("pages", scope, pages);
		scope.put("outputStream", scope, os);
		scope.put(PdfHelper.class.getSimpleName(), scope, new PdfHelper());
		
		final StringBuilder source = new StringBuilder();
		source.append("importPackage(com.lowagie.text);");
		source.append("importPackage(com.lowagie.text.pdf);");
		source.append("new openform.Form(\"form\", $.parseJSON(form), $.parseJSON(dataSources)).renderPdf(pages, outputStream);");
		context.evaluateString(global, source.toString(), this.getClass().getName(), 1, null);
	}
	
	private void loadFile(final InputStream is, final int index) throws PdfGenerateException {
		Reader reader = null;
		try {
			reader = new InputStreamReader(is);
			context.evaluateReader(scope, reader, this.getClass().getName() + "#" + index, 1, null);
		} catch (final IOException e) {
			throw new PdfGenerateException(e.getMessage(), e);
		} finally {
			IOUtils.closeQuietly(reader);
		}
	}
	
}
